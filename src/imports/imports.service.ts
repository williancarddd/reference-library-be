import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../databases/prisma/prisma.service';
import * as fastcsv from 'fast-csv';
import { Readable } from 'stream';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { find } from 'rxjs';

@Injectable()
export class ImportsService {
  constructor(private readonly prisma: PrismaService) {}

  async importFromPPC(buffer: Buffer, createCourse: CreateCourseDto): Promise<any> {
    return new Promise((resolve, reject) => {
      const PPC: {
        titulo: string;
        Disciplina: string;
        autor: string;
        editora: string;
        ano: string;
        CargaHoraria: number;
        HorasPratica: number;
        HorasTeorica: number;
        edicao: string;
        Periodo: string;
        Tipo: string;
      }[] = [];

      // Criar um stream a partir do buffer (em memória)
      const stream = Readable.from(buffer.toString());

      stream
        .pipe(fastcsv.parse({ headers: true }))
        .on('data', (row) => {
          PPC.push({
            titulo: row.titulo,
            Disciplina: row.Disciplina,
            autor: row.autor,
            editora: row.editora,
            ano: row.ano,
            CargaHoraria: row.CargaHoraria,
            HorasPratica: row.HorasPratica,
            HorasTeorica: row.HorasTeorica,
            edicao: row.edicao,
            Periodo: row.Periodo,
            Tipo: row.Tipo
          });
        })
        .on('end', async () => {
          try {
            const findCourse = await this.prisma.course.findFirst({
              where: {name: createCourse.name}
            })

            if(findCourse){
              await this.prisma.course.delete({
                where: {
                  id: findCourse.id
                }
              })
            }

            const course = await this.prisma.course.create({
              data: createCourse
            })

            const disciplinaVistas = new Set();
            const disciplinas = PPC.filter((item)=>{
              if(!disciplinaVistas.has(item.Disciplina)){
                disciplinaVistas.add(item.Disciplina);
                return true;
              }
              return false;
            })

            for(let i=0;i<disciplinas.length;i++){
              
                await this.prisma.discipline.create({
                  data: {courseId: course.id, theoreticalHours: +disciplinas[i].HorasTeorica,
                    cargaHoraria: +disciplinas[i].CargaHoraria, period: disciplinas[i].Periodo, name: disciplinas[i].Disciplina, practicalHours: +disciplinas[i].HorasPratica
                   }}
                )
            }

            const disciplinasBanco = await this.prisma.discipline.findMany();

            for(let i=0;i<PPC.length;i++){
              for(let j=0;j<disciplinasBanco.length;j++){
                  if(PPC[i].Disciplina==disciplinasBanco[j].name){
                    await this.prisma.reference.create({
                      data: {
                        title: PPC[i].titulo, authors: PPC[i].autor, year: +PPC[i].ano, edition: +PPC[i].edicao, 
                        publisher: PPC[i].editora, disciplineId: disciplinasBanco[j].id, courseId: course.id, type: PPC[i].Tipo
                      }
                    })
                  }
              }
            }


            resolve({ message: 'ppc importado com sucesso' });

          } catch (err) {
            reject(err);
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  async importFromCsv(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      const books: {
        title: string;
        catalogingId: string;
        author: string; 
        publisher: string;
        year: string;
        publicationPlace: string;
        edition: string;
      }[] = [];

      // Criar um stream a partir do buffer (em memória)
      const stream = Readable.from(buffer.toString());

      stream
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => {
        books.push({
          title: row.titulo,
          author: row.autor,
          catalogingId: row.id_titulo_catalografico,
          publisher: row.editora,
          year: row.ano,
          publicationPlace: row.local_publicacao,
          edition: row.edicao,
        });
      })
      .on('end', async () => {
        try {
          await this.prisma.book.createMany({
            data: books,
            skipDuplicates: true,
          });

          resolve({ message: 'Importação concluída', count: books.length });
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (error) => reject(error));
    });
  }
}
