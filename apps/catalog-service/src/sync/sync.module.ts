import { Module } from '@nestjs/common';
import { SearchModule } from '../search/search.module';
import { SyncService } from './sync.service';

@Module({
  imports: [SearchModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
