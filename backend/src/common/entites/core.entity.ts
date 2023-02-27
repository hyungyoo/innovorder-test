import { ApiProperty } from "@nestjs/swagger";
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * CoreEntity has common columns :  id, createdAt and updatedAt.
 */
@Entity()
export class CoreEntity {
  @ApiProperty({ example: 1, description: "The ID of the entity" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "2023-03-01T00:00:00.000Z",
    description: "The date and time that this entity was created",
  })
  @CreateDateColumn({ name: "create_at" })
  createdAt: Date;

  @ApiProperty({
    example: "2023-03-01T00:00:00.000Z",
    description: "The date and time that this entity was last updated",
  })
  @UpdateDateColumn({ name: "update_at" })
  updatedAt: Date;
}
