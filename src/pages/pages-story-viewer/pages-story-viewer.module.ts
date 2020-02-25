import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesStoryViewerPage } from './pages-story-viewer';

@NgModule({
  declarations: [
    PagesStoryViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesStoryViewerPage),
  ],
})
export class PagesStoryViewerPageModule {}
