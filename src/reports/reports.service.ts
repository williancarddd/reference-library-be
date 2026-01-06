import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/databases/prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(private prismaService: PrismaService) {}

  private cleanString(str: string): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .trim();
  }

  private prepareTitle(title: string) {
    const cleaned = this.cleanString(title);
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    
    return {
      original: title,
      noSpaces: cleaned.replace(/\s+/g, ""),
      firstWord: words.length > 0 ? words[0] : "",
      wordCount: words.length
    };
  }

  /**
   * Compara se há match por título idêntico ou apenas pela primeira palavra.
   */
  private titlesMatch(
    ref: { noSpaces: string; firstWord: string }, 
    book: { noSpaces: string; firstWord: string }
  ): boolean {
    if (!ref.firstWord || !book.firstWord) return false;
    if (ref.noSpaces === book.noSpaces) return true;
    return ref.firstWord === book.firstWord;
  }

  /**
   * Helper para tratar edições nulas ou vazias.
   */
  private formatEdition(edition: string | null | undefined): string {
    return (edition && edition.trim()) ? edition.trim() : 'Não informado';
  }

  async reportCourseDisciplines() {
    const courses = await this.prismaService.course.findMany({
      include: { disciplines: true },
    });

    return courses.map((course) => ({
      course: course.name,
      total: course.disciplines.length,
      disciplines: course.disciplines
    }));
  }

  async reportReferences(id: number) {
    const [referenceRecords, allBooks] = await Promise.all([
      this.prismaService.reference.findMany({ where: { courseId: id }, select: { title: true } }),
      this.prismaService.book.findMany() // Busca todos os campos, incluindo edition
    ]);

    const preparedRefs = referenceRecords.map(ref => this.prepareTitle(ref.title));
    
    const matchedBooks = allBooks.filter(book => {
      const preparedBook = this.prepareTitle(book.title);
      return preparedRefs.some(ref => this.titlesMatch(ref, preparedBook));
    });

    return matchedBooks.reduce((aggregator, book) => {
      const title = book.title;
      if (!aggregator[title]) aggregator[title] = { editions: {}, total: 0 };

      const editionLabel = this.formatEdition(book.edition);
      aggregator[title].editions[editionLabel] = (aggregator[title].editions[editionLabel] || 0) + 1;
      aggregator[title].total += 1;

      return aggregator;
    }, {} as any);
  }

  async reportCopiesByReference(courseId: number) {
    const [references, allBooks] = await Promise.all([
      this.prismaService.reference.findMany({
        where: { courseId },
        select: { id: true, title: true }
      }),
      this.prismaService.book.findMany({
        select: { title: true, edition: true }
      })
    ]);

    const preparedBooks = allBooks.map(book => ({
      ...book,
      ...this.prepareTitle(book.title)
    }));

    const details = references.map(ref => {
      const preparedRef = this.prepareTitle(ref.title);
      const matchingBooks = preparedBooks.filter(book => this.titlesMatch(preparedRef, book));

      const byEdition = matchingBooks.reduce((acc, book) => {
        const edition = this.formatEdition(book.edition);
        acc[edition] = (acc[edition] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        referenceId: ref.id,
        referenceTitle: ref.title,
        totalCopies: matchingBooks.length,
        hasBooks: matchingBooks.length > 0,
        byEdition
      };
    });

    return {
      totalReferences: references.length,
      referencesWithBooks: details.filter(r => r.hasBooks).length,
      referencesWithoutBooks: details.filter(r => !r.hasBooks).length,
      details
    };
  }

  async reportCopiesByDiscipline(courseId: number) {
    const [disciplines, allBooks] = await Promise.all([
      this.prismaService.discipline.findMany({
        where: { courseId },
        include: { references: { select: { id: true, title: true } } }
      }),
      this.prismaService.book.findMany({ select: { title: true } })
    ]);

    const preparedBooks = allBooks.map(book => this.prepareTitle(book.title));

    const report = disciplines.map(discipline => {
      let totalBooks = 0;
      const referencesDetails = discipline.references.map(ref => {
        const preparedRef = this.prepareTitle(ref.title);
        const copies = preparedBooks.filter(book => this.titlesMatch(preparedRef, book)).length;
        totalBooks += copies;
        return { referenceTitle: ref.title, copies };
      });

      return {
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        totalReferences: discipline.references.length,
        totalBooks,
        averageBooksPerReference: discipline.references.length > 0 
          ? (totalBooks / discipline.references.length).toFixed(2) : '0',
        references: referencesDetails
      };
    });

    return report.sort((a, b) => b.totalBooks - a.totalBooks);
  }

  async reportCoverageByDiscipline(courseId: number) {
    const [disciplines, allBooks] = await Promise.all([
      this.prismaService.discipline.findMany({
        where: { courseId },
        include: { references: { select: { id: true, title: true } } }
      }),
      this.prismaService.book.findMany({ select: { title: true } })
    ]);

    const preparedBooks = allBooks.map(book => this.prepareTitle(book.title));

    const report = disciplines.map(discipline => {
      const referencesWithBooks = discipline.references.filter(ref => {
        const preparedRef = this.prepareTitle(ref.title);
        return preparedBooks.some(book => this.titlesMatch(preparedRef, book));
      });

      const total = discipline.references.length;
      const count = referencesWithBooks.length;
      
      return {
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        totalReferences: total,
        referencesWithBooks: count,
        coveragePercentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(2)) : 0
      };
    });

    return report.sort((a, b) => a.coveragePercentage - b.coveragePercentage);
  }

  async reportSharedReferences(courseId: number) {
    const disciplines = await this.prismaService.discipline.findMany({
      where: { courseId },
      include: { references: { select: { id: true, title: true } } }
    });

    const referenceMap = new Map<string, {
      originalTitle: string,
      disciplines: Array<{ id: number, name: string }>,
      referenceIds: number[]
    }>();

    disciplines.forEach(discipline => {
      discipline.references.forEach(ref => {
        const prepared = this.prepareTitle(ref.title);
        const key = prepared.firstWord || prepared.noSpaces;

        if (!referenceMap.has(key)) {
          referenceMap.set(key, { originalTitle: ref.title, disciplines: [], referenceIds: [] });
        }

        const entry = referenceMap.get(key)!;
        if (!entry.disciplines.some(d => d.id === discipline.id)) {
          entry.disciplines.push({ id: discipline.id, name: discipline.name });
        }
        if (!entry.referenceIds.includes(ref.id)) {
          entry.referenceIds.push(ref.id);
        }
      });
    });

    const sharedReferences = Array.from(referenceMap.values())
      .filter(ref => ref.disciplines.length > 1)
      .map(ref => ({
        referenceTitle: ref.originalTitle,
        sharedBy: ref.disciplines.length,
        disciplines: ref.disciplines,
        referenceIds: ref.referenceIds
      }))
      .sort((a, b) => b.sharedBy - a.sharedBy);

    return { totalSharedReferences: sharedReferences.length, sharedReferences };
  }
}
