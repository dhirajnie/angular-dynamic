import { ConfirmationWidgetModule } from './confirmation-widget.module';

describe('ConfirmationWidgetModule', () => {
  let confirmationWidgetModule: ConfirmationWidgetModule;

  beforeEach(() => {
    confirmationWidgetModule = new ConfirmationWidgetModule();
  });

  it('should create an instance', () => {
    expect(confirmationWidgetModule).toBeTruthy();
  });
});
