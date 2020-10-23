import { SliderWidgetModule } from './slider-widget.module';

describe('SliderWidgetModule', () => {
  let sliderWidgetModule: SliderWidgetModule;

  beforeEach(() => {
    sliderWidgetModule = new SliderWidgetModule();
  });

  it('should create an instance', () => {
    expect(sliderWidgetModule).toBeTruthy();
  });
});
