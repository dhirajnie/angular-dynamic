import { FeebackModule } from './feeback.module';

describe('FeebackModule', () => {
  let feebackModule: FeebackModule;

  beforeEach(() => {
    feebackModule = new FeebackModule();
  });

  it('should create an instance', () => {
    expect(feebackModule).toBeTruthy();
  });
});
