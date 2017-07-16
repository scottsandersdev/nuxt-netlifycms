<template>
  <div class="date-picker">
    <div class="input-with-icon">
      <input :id="inputId"
        class="input-with-icon__input"
        :class="{ 'input--error': !valid }"
        type="text"
        :name="name"
        :placeholder="getPlaceholder"
        ref="input"
        @change="validate">

      <button class="input-with-icon__button"
        ref="toggleButton"
        @click.prevent="toggle"
        :aria-controls="id">
        <span class="visually-hidden">{{ toggleLabel }}</span>
        <svg class="input-with-icon__icon"
          :class="{ 'input-with-icon__icon--alert': !valid }">
          <use xlink:href="#calendar-light"></use>
        </svg>
      </button>

      <div :id="id"
        class="date-picker__ui"
        v-show="toggled"
        :aria-hidden="(!toggled).toString()">
        <span class="visually-hidden">
          Use page-up and page-down to change the current month. Use the arrow
          keys to change the day. Hit enter or space to select the date.
        </span>

        <i class="date-picker__arrow"></i>

        <div class="date-picker-controls">
          <span class="date-picker-controls__month">
            <span class="visually-hidden">Currently viewing</span>
            {{ getMonthName }} {{ year }}
          </span>

          <button class="button button--icon-only date-picker-controls__button"
            @click.prevent="prevMonth"
            @focus.prevent="setDateSelectionViaKeypress(false)"
            @blur.prevent="setDateSelectionViaKeypress(true)">
            <svg class="icon">
              <span class="visually-hidden">Previous month</span>
              <use xlink:href="#chevron-light-left"></use>
            </svg>
          </button>

          <button
            class="button button--icon-only date-picker-controls__button
            date-picker-controls__button--next"
            @click.prevent="nextMonth"
            @focus.prevent="setDateSelectionViaKeypress(false)"
            @blur.prevent="setDateSelectionViaKeypress(true)">
            <svg class="icon">
              <span class="visually-hidden">Next month</span>
              <use xlink:href="#chevron-light-right"></use>
            </svg>
          </button>
        </div>

        <div class="date-picker-calendar">
          <div class="date-picker-calendar__header-week" aria-hidden="true">
            <div class="date-picker-calendar__header-day">Su</div>
            <div class="date-picker-calendar__header-day">Mo</div>
            <div class="date-picker-calendar__header-day">Tu</div>
            <div class="date-picker-calendar__header-day">We</div>
            <div class="date-picker-calendar__header-day">Th</div>
            <div class="date-picker-calendar__header-day">Fr</div>
            <div class="date-picker-calendar__header-day">Sa</div>
          </div>

          <div class="date-picker-calendar__week"
            v-for="(week, weekIndex) in getCalendar"
            :key="weekIndex">
            <div class="date-picker-calendar__day"
              v-for="(day, dayIndex) in week"
              :key="dayIndex">
              <button class="date-picker-calendar__day-button"
                :id="getDayId(day, month, year)"
                v-if="day"
                @click.prevent="select(day)"
                @focus.prevent="setCurrentDay(day)">
                <span class="date-picker-calendar__day-button-inner"
                  :class="{
                    'date-picker-calendar__day-button-inner--current':
                      isCurrent(day)
                  }">
                  <span class="visually-hidden">
                    Select {{ getDayName(dayIndex) }}, {{ getMonthName }}
                  </span>
                  {{ day }}
                  <span class="visually-hidden">
                    , {{ year }}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <span class="input-error-msg" v-if="!valid">
      <svg class="icon icon--alert input-error-icon">
        <use xlink:href="#alert-heavy"></use>
      </svg>
      Please enter a valid date in mm/dd/yyyy format.
    </span>
  </div>
</template>

<script type="text/javascript">
import calendar from 'calendar-js';
import domHelpers from '../../helpers/dom.js';
import Vue from 'vue';

let uid = 0;
const today = new Date();

export default {
  name: 'utxd-date-picker',

  props: [
    'input-id',
    'name',
    'placeholder',
    'value'
  ],

  data () {
    return {
      dateSelectionViaKeypress: true,
      day: today.getDate(),
      id: '',
      month: today.getMonth(),
      toggled: false,
      valid: true,
      year: today.getFullYear()
    };
  },

  computed: {
    /**
     * Returns the current calendar layout according to the currently stored
     * year and month.
     * @return {Array<Array<number>>} A nested array containing the weeks and
     *     days of the currently stored month/year.
     */
    getCalendar () {
      return calendar().of(this.year, this.month).calendar;
    },

    /**
     * Returns the full name of the currently stored month value.
     * @return {string} The full name of the currently stored month.
     */
    getMonthName () {
      return calendar().months()[this.month];
    },

    /**
     * Returns the custom placeholder prop value or default placeholder string.
     * @return {string} The input placeholder string.
     */
    getPlaceholder () {
      return this.placeholder || 'Enter a date (mm/dd/yyyy)';
    },

    /**
     * Returns a label for the toggle for screen readers.
     * @return {string} A label contingent upon toggled state.
     */
    toggleLabel () {
      return this.toggled ? 'Close the date picker' : 'Open the date picker';
    }
  },

  methods: {
    /**
     * Checks whether the currently stored day falls out of bounds of the
     * current stored month, and adjusts the day and month accordingly.
     */
    adjustForDayChange () {
      const numDaysInCurMonth = calendar().of(this.year, this.month).days;

      if (this.day <= 0) {
        this.prevMonth();
        this.day = calendar().of(this.year, this.month).days + this.day;
      } else if (this.day > numDaysInCurMonth) {
        this.day = this.day - numDaysInCurMonth;
        this.nextMonth();
      }

      this.setDayFocus();
    },

    /**
     * Checks whether the currently stored day exceeds the number of days in the
     * newly stored month. If so, sets the day to the closest day in the new
     * month.
     */
    adjustForMonthChange () {
      const numDaysInCurMonth = calendar().of(this.year, this.month).days;

      if (this.day > numDaysInCurMonth) {
        this.day = numDaysInCurMonth;
      }

      this.setDayFocus();
    },

    /**
     * Returns a unique ID for a day button element.
     * @param {number} day The day.
     * @param {number} month The month.
     * @param {number} year The year.
     * @return {string} An ID for the day button element.
     */
    getDayId (day, month, year) {
      return `${this.id}-${year}-${month}-${day}`;
    },

    /**
     * Returns the day of the week associated with the passed in index.
     * @param {Number} dayIndex The number of the day in a week.
     * @return {string} The name of the day of the week.
     */
    getDayName (dayIndex) {
      return calendar().of(this.year, this.month).weekdays[dayIndex];
    },

    /**
     * Hides the date picker ui if the user clicks anywhere else in the window.
     * @param {Event} e A document click event.
     */
    handleDocumentClick (e) {
      if (this.toggled &&
          !domHelpers.getAncestorByClassName(e.target, 'date-picker__ui')) {
        this.toggle();
      }
    },

    /**
     * Handles a keydown event.
     * @param {Event} e The keydown event.
     */
    handleKeydown (e) {
      if (e.key !== 'Tab') {
        switch(e.key) {
          case 'ArrowDown':
          case 'Down': // IE case
            e.preventDefault();
            this.nextWeek();
            break;
          case 'ArrowLeft':
          case 'Left': // IE case
            e.preventDefault();
            this.prevDay();
            break;
          case 'ArrowRight':
          case 'Right': // IE case
            e.preventDefault();
            this.nextDay();
            break;
          case 'ArrowUp':
          case 'Up': // IE case
            e.preventDefault();
            this.prevWeek();
            break;
          case 'Enter':
          case ' ':
            if (this.dateSelectionViaKeypress) {
              e.preventDefault();
              this.select(this.day);
            }
            break;
          case 'Esc': // IE case
          case 'Escape':
            this.toggle();
            break;
          case 'PageDown':
            e.preventDefault();
            this.nextMonth();
            break;
          case 'PageUp':
            e.preventDefault();
            this.prevMonth();
            break;
        }
      } else {
        this.toggle();
      }
    },

    /**
     * Determines whether or not a value matches the currently stored day.
     * @param {number} day A value representing a day of the month.
     * @return Whether or not the passed in day matches currently stored day.
     */
    isCurrent (day) {
      return day === this.day;
    },

    /**
     * Increments the current day value to the next day.
     */
    nextDay () {
      this.day++;
      this.adjustForDayChange();
    },

    /**
     * Increments current month value to the next month.
     */
    nextMonth () {
      this.month++;

      if (this.month > 11) {
        this.month = 0;
        this.year++;
      }

      this.adjustForMonthChange();
    },

    /**
     * Increments current day value to the next week.
     */
    nextWeek () {
      this.day = this.day + 7;
      this.adjustForDayChange();
    },

    /**
     * Decrements the current day value to the previous day.
     */
    prevDay () {
      this.day--;
      this.adjustForDayChange();
    },

    /**
     * Decrements current month value to previous month.
     */
    prevMonth () {
      this.month--;

      if (this.month < 0) {
        this.month = 11;
        this.year--;
      }

      this.adjustForMonthChange();
    },

    /**
     * Decrements current day value to the previous week.
     */
    prevWeek () {
      this.day = this.day - 7;
      this.adjustForDayChange();
    },

    /**
     * Sets the input value to the selected day.
     * @param {number} day A value representing a day of the month.
     */
    select (day) {
      this.day = day;
      this.toggle();
      this.$refs.input.value = `${this.month + 1}/${this.day}/${this.year}`;
      this.$refs.toggleButton.focus();
      this.validate();
    },

    /**
     * Sets current day. Called during day button element focus through screen
     * reader navigation.
     * @param {number} day A value representing a day of the month.
     */
    setCurrentDay (day) {
      this.day = day;
    },

    /**
     * Sets the dateSelectionViaKeypress flag, which is used to determine
     * whether hitting ENTER or SPACE should select the currently highlighted
     * date or pass through to an element with focus.
     *
     * Ex: screen readers allow focus navigation to the prev/next month buttons.
     * On focus, we set dateSelectionViaKeypress to true, which allows the user
     * to trigger the button's click handler instead of selecting the current
     * date and closing the UI.
     *
     * @param {boolean} dateSelectionViaKeypress Whether date selection via
     *     keyboard is active or not.
     */
    setDateSelectionViaKeypress (dateSelectionViaKeypress) {
      this.dateSelectionViaKeypress = dateSelectionViaKeypress;
    },

    /**
     * Sets focus on the currently selected day for accessibility. Ensures that
     * screen reader focus is synced with the selected day state.
     */
    setDayFocus () {
      Vue.nextTick(() => {
        const id = `${this.id}-${this.year}-${this.month}-${this.day}`;
        const el = document.getElementById(id);
        el.focus();
      });
    },

    /**
     * Toggles the visibility of the date picker UI.
     */
    toggle () {
      this.toggled = !this.toggled;

      if (this.toggled) {
        setTimeout(() => {
          document.addEventListener('click', this.handleDocumentClick);
          document.addEventListener('keydown', this.handleKeydown);
        }, 0);
      } else {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keydown', this.handleKeydown);
      }
    },

    /**
     * Validates the current input value according to mm/dd/yyyy format.
     */
    validate () {
      let valid = false;
      const value = this.$refs.input.value;

      if (value === '') {
        valid = true;
      } else if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
        const dateParts = value.split('/');
        const day = parseInt(dateParts[1]);
        const month = parseInt(dateParts[0]) - 1;
        const year = parseInt(dateParts[2]);

        if (month >= 0 && month < 12) {
          const numDaysInMonth = calendar().of(year, month).days;

          if (day > 0 && day <= numDaysInMonth) {
            valid = true;
            this.day = day;
            this.month = month;
            this.year = year;
          }
        }
      }

      this.valid = valid;
    }
  },

  created () {
    this.id = `utxd-date-picker-${uid}`;
    uid++;
  },

  mounted () {
    if (this.value) {
      this.$refs.input.value = this.value;
      this.validate();
    }
  }
};
</script>

<style lang='scss'>
@import 'sass/index';
</style>
