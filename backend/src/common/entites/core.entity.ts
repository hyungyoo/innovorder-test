import { ApiProperty } from "@nestjs/swagger";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * CoreEntity has common columns :  id, createdAt, and updatedAt.
 */
@Entity()
export class CoreEntity {
  @ApiProperty({ example: 1, description: "The ID of the entity" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "2023-03-01T00:00:00.000Z",
    description: "The date and time that this entity was created",
    required: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: "2023-03-01T00:00:00.000Z",
    description: "The date and time that this entity was last updated",
    required: true,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
