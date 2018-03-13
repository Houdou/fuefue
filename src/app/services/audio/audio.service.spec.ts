import { TestBed, inject } from '@angular/core/testing';

import { FueAudioService } from './audio.service';

describe('FueAudioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FueAudioService]
    });
  });

  it('should be created', inject([FueAudioService], (service: FueAudioService) => {
    expect(service).toBeTruthy();
  }));
});
