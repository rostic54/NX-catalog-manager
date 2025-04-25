import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserPsg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  userName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  @Index({ unique: true })
  email: string;
}
