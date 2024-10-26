import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  members: [{ name: string; email: string; access_level: string }];
}

export const organizationSchema = SchemaFactory.createForClass(Organization);
