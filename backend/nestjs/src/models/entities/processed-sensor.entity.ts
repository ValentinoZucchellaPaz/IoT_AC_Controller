import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sensor_readings')
export class ProcessedSensorData {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  device_id!: string;

  @Column()
  ac_state!: boolean;

  @Column('float')
  desired_temperature!: number;

  @Column('float')
  min_temperature!: number;

  @Column('float')
  max_temperature!: number;

  @Column('float')
  avg_temperature!: number;

  @Column('bigint')
  ts_end!: number;

  @CreateDateColumn()
  created_at!: Date;
}
