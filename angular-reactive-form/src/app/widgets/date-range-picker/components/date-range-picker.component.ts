import { Component, OnInit, EventEmitter, Output, ElementRef, Input, ViewChild } from '@angular/core';
import { DatePickerOptions } from "../../../shared/schemas/date-picker-options";
import { VariableService } from "../../../shared/services/utilities/util_variable/variable.service";
import { TranslateService } from '../../../shared/services/translate/translate.service';
import { StringConstants } from "../../../shared/constants/string-constants";
import { GlobalService } from "../../../shared/services/global/global.service";

declare var $: any;

@Component({
  selector: 'idm-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  selectedDateValue: any;
  focusInputGroup: boolean = false;
  placeholder: string = "";
  @Input("selectedDate")
  public get selectedDate() {
    return this.selectedDateValue;
  }
  public set selectedDate(val) {

    this.selectedDateValue = val;
    //this.selectedDateChange.emit(this.selectedDateValue);
  }
  @Output("selectedDateChange") selectedDateChange = new EventEmitter<any>();

  @Input('isEditable') isEditable?: boolean = true;
  @Input("datePickerOptions") datePickerOptions: DatePickerOptions;

  touchedValue: boolean = false;

  @Input("touched")
  public get touched() {
    return this.touchedValue;
  }
  public set touched(val) {
    this.touchedValue = val;

    this.touchedChange.emit(this.touched);
  }
  @Output("touchedChange") touchedChange = new EventEmitter<boolean>();

  // focusedout

  focusedoutValue: boolean = false;
  @Input("focusedout")
  public get focusedout() {
    return this.focusedoutValue;
  }
  public set focusedout(val) {
    this.focusedoutValue = val;

    this.focusedoutChange.emit(this.focusedout);
  }
  @Output("focusedoutChange") focusedoutChange = new EventEmitter<boolean>();

  @ViewChild('dateRangePicker') dateRangePickerElem: ElementRef;

  locale: object = {};
  applyLabel: string;
  clearLabel: string;
  fromLabel: string;
  toLabel: string;
  customRangeLabel: string;
  daysOfWeek: any;
  monthNames: any;
  dateConfig: any;
  //for localization

  constructor(private _eref: ElementRef, private variableService: VariableService, private translate: TranslateService, private globalService: GlobalService,
    private stringConstants: StringConstants) { }

  ngOnInit() {
    this.applyLabel = this.translate.get('Apply');
    this.clearLabel = this.translate.get('Clear');
    this.fromLabel = this.translate.get('From');
    this.toLabel = this.translate.get('To');
    this.customRangeLabel = this.translate.get('Custom');
    this.daysOfWeek = [
      this.translate.get('Su'),
      this.translate.get('Mo'),
      this.translate.get('Tu'),
      this.translate.get('We'),
      this.translate.get('Th'),
      this.translate.get('Fr'),
      this.translate.get('Sa')
    ];
    this.monthNames = [
      this.translate.get('January'),
      this.translate.get('February'),
      this.translate.get('March'),
      this.translate.get('April'),
      this.translate.get('May'),
      this.translate.get('June'),
      this.translate.get('July'),
      this.translate.get('August'),
      this.translate.get('September'),
      this.translate.get('October'),
      this.translate.get('November'),
      this.translate.get('December')
    ];
    this.datePicker();

  }

  datePicker() {
    let that = this;
    let selector = this.dateRangePickerElem.nativeElement.children.daterange;
    let parentElement = $(".dateRangepickerParentElement");
    if (!this.variableService.isEmptyString(this.datePickerOptions.placeholder)) {
      this.placeholder = this.datePickerOptions.placeholder;
    }

    if (!this.variableService.isUndefinedOrNull(this.datePickerOptions.minDate)) {
      this.dateConfig = {
        singleDatePicker: this.datePickerOptions.singleDatePicker,
        showDropdowns: this.datePickerOptions.showDropdowns,
        autoApply: this.datePickerOptions.autoApply,
        drops: this.datePickerOptions.drops,
        timePicker: this.datePickerOptions.timePicker,
        autoUpdateInput: this.datePickerOptions.autoUpdateInput,
        minDate: this.datePickerOptions.minDate,
        parentEl: parentElement,
        locale: {
          format: this.stringConstants.dateFormat,
          "separator": " - ",
          "applyLabel": this.applyLabel,
          "cancelLabel": this.clearLabel,
          "fromLabel": this.fromLabel,
          "toLabel": this.toLabel,
          "customRangeLabel": this.customRangeLabel,
          "weekLabel": "W",
          "daysOfWeek": this.daysOfWeek,
          "monthNames": this.monthNames
        }
      }
    }
    else {
      this.dateConfig = {
        singleDatePicker: this.datePickerOptions.singleDatePicker,
        showDropdowns: this.datePickerOptions.showDropdowns,
        autoApply: this.datePickerOptions.autoApply,
        drops: this.datePickerOptions.drops,
        timePicker: this.datePickerOptions.timePicker,
        autoUpdateInput: this.datePickerOptions.autoUpdateInput,
        parentEl: parentElement,
        locale: {
          format: this.stringConstants.dateFormat,
          "separator": " - ",
          "applyLabel": this.applyLabel,
          "cancelLabel": this.clearLabel,
          "fromLabel": this.fromLabel,
          "toLabel": this.toLabel,
          "customRangeLabel": this.customRangeLabel,
          "weekLabel": "W",
          "daysOfWeek": this.daysOfWeek,
          "monthNames": this.monthNames
        }
      }
    }



    $(selector).daterangepicker(this.dateConfig, function (choosenDate) {
    }).on('apply.daterangepicker', function (ev, picker) {
      that.selectedDate = picker.startDate.format('x');
      that.emitTheChange();
      $(this).val(that.globalService.dateFormatter(that.selectedDate));
    }).on('cancel.daterangepicker', function (ev, picker) {
      that.selectedDate = '';
      that.emitTheChange();
      $(this).val('');
    });

    if (this.selectedDate != "") {
      $(selector).val(that.globalService.dateFormatter(that.selectedDate));
    }

  }

  emitTheChange() {
    this.selectedDateChange.emit({ date: this.selectedDateValue });
  }

  onFocusInput() {
    this.focusInputGroup = true;
    this.touched = true;
  }

  onBlurInput() {
    this.focusInputGroup = false;
    this.focusedout = true;
  }

  dateChanged(event) {
    if (this.variableService.isEmptyString(event.target.value)) {
      this.selectedDateValue = '';
      this.emitTheChange();
    }
  }

}
