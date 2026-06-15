import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sensor_health')
export class HealthSensorData {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  device_id!: string;

  @Column()
  status!: boolean;

  @Column({
    type: 'timestamptz',
  })
  ts_end!: Date;
}
