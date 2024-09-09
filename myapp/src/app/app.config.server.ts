import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { ROUTES } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideServerRendering(),
    {
      provide: ROUTES,
      multi: true,
      useValue: [
        {
          path: 'shell',
          component: AppShellComponent,
        },
      ],
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
