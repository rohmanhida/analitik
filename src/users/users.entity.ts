import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// - id, email, password_hash, email_verified, created_at
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  email_verified: boolean;

  @Column()
  created_at: Date;
}
