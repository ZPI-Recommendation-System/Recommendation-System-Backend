import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BenchmarkEntity } from "./benchmark.entity";

@Entity()
export class ProcessorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column({ nullable: true })
  series: string;

  @Column({ nullable: true })
  cores: number;

  @Column("float", { nullable: true })
  frequency: number;

  @ManyToOne(() => BenchmarkEntity, { eager: true, cascade: ["insert"] })
  benchmark: BenchmarkEntity;
}
