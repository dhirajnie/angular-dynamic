import { UIDispalyModule } from './uidispaly.module';

describe('UIDispalyModule', () => {
  let uIDispalyModule: UIDispalyModule;

  beforeEach(() => {
    uIDispalyModule = new UIDispalyModule();
  });

  it('should create an instance', () => {
    expect(uIDispalyModule).toBeTruthy();
  });
});
