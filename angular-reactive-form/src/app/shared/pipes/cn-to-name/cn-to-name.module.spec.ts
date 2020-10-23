import { CnToNameModule } from './cn-to-name.module';

describe('CnToNameModule', () => {
  let cnToNameModule: CnToNameModule;

  beforeEach(() => {
    cnToNameModule = new CnToNameModule();
  });

  it('should create an instance', () => {
    expect(cnToNameModule).toBeTruthy();
  });
});
