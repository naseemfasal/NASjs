/**
 * NASjs - Beautiful, Lightweight UI Components
 * Modern DatePicker, TimePicker, Event Calendar, Image Gallery, Modal & Confirmation Dialogs
 * A lightweight jQuery UI & SweetAlert alternative for modern web applications
 *
 * @version 1.5.0
 * @license MIT
 * @author Naseem Fasal Palappetty
 * @homepage https://naseemfasal.github.io/NASjs/
 * @description Framework-agnostic UI component library - Zero dependencies, works with React, Vue, Angular or vanilla JS
 */

(function(global) {
  'use strict';

  const NASjs = {
    version: '1.5.0',
    author: 'Naseem Fasal Palappetty',
    
    /**
     * DatePicker Component
     */
    datePicker: function(options = {}) {
      const defaults = {
        selector: '.datepicker-input',
        format: 'YYYY-MM-DD',
        minDate: null,
        maxDate: null,
        onSelect: null
      };
      
      const config = { ...defaults, ...options };
      
      class DatePicker {
        constructor(config) {
          this.config = config;
          this.currentDate = new Date();
          this.selectedDate = null;
          this.activeInput = null;
          this.picker = null;
          this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          this.init();
        }
        
        init() {
          this.createPicker();
          this.attachToInputs();
          this.attachGlobalEvents();
        }
        
        createPicker() {
          this.picker = document.createElement('div');
          this.picker.className = 'nasjs-datepicker';
          this.picker.style.display = 'none';
          document.body.appendChild(this.picker);
        }
        
        attachToInputs() {
          const inputs = document.querySelectorAll(this.config.selector);
          inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.style.cursor = 'pointer';
            input.addEventListener('click', (e) => {
              e.stopPropagation();
              this.show(input);
            });
          });
        }
        
        attachGlobalEvents() {
          document.addEventListener('click', (e) => {
            if (!e.target.closest('.nasjs-datepicker') && 
                !e.target.closest(this.config.selector)) {
              this.hide();
            }
          });
          
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
          });
        }
        
        show(input) {
          this.activeInput = input;
          
          if (input.value) {
            const parsed = this.parseDate(input.value);
            if (parsed) {
              this.currentDate = new Date(parsed);
              this.selectedDate = new Date(parsed);
            }
          }
          
          this.render();
          this.position(input);
          this.picker.style.display = 'block';
          setTimeout(() => this.picker.classList.add('nasjs-visible'), 10);
        }
        
        hide() {
          this.picker.classList.remove('nasjs-visible');
          setTimeout(() => {
            this.picker.style.display = 'none';
          }, 200);
        }
        
        position(input) {
          const rect = input.getBoundingClientRect();
          const pickerHeight = 340;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          
          let top = rect.bottom + window.scrollY + 5;
          
          if (spaceBelow < pickerHeight && spaceAbove > spaceBelow) {
            top = rect.top + window.scrollY - pickerHeight - 5;
          }
          
          this.picker.style.top = `${top}px`;
          this.picker.style.left = `${rect.left + window.scrollX}px`;
          
          setTimeout(() => {
            const pickerRect = this.picker.getBoundingClientRect();
            if (pickerRect.right > window.innerWidth) {
              this.picker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
            }
          }, 0);
        }
        
        render() {
          const year = this.currentDate.getFullYear();
          const month = this.currentDate.getMonth();
          
          this.picker.innerHTML = `
            <div class="nasjs-dp-header">
              <button class="nasjs-dp-nav" data-action="prev">‹</button>
              <div class="nasjs-dp-selectors">
                <select class="nasjs-dp-month">${this.renderMonthOptions(month)}</select>
                <select class="nasjs-dp-year">${this.renderYearOptions(year)}</select>
              </div>
              <button class="nasjs-dp-nav" data-action="next">›</button>
            </div>
            <div class="nasjs-dp-calendar">
              ${this.renderDaysHeader()}
              ${this.renderDays()}
            </div>
            <div class="nasjs-dp-footer">
              <button class="nasjs-dp-btn" data-action="today">Today</button>
              <button class="nasjs-dp-btn" data-action="clear">Clear</button>
            </div>
          `;
          
          this.attachPickerEvents();
        }
        
        renderMonthOptions(selectedMonth) {
          return this.months.map((month, index) => 
            `<option value="${index}" ${index === selectedMonth ? 'selected' : ''}>${month}</option>`
          ).join('');
        }
        
        renderYearOptions(selectedYear) {
          const currentYear = new Date().getFullYear();
          const startYear = currentYear - 100;
          const endYear = currentYear + 10;
          let options = '';
          
          for (let year = endYear; year >= startYear; year--) {
            options += `<option value="${year}" ${year === selectedYear ? 'selected' : ''}>${year}</option>`;
          }
          
          return options;
        }
        
        renderDaysHeader() {
          const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
          return `<div class="nasjs-dp-days-header">${days.map(day => 
            `<div class="nasjs-dp-day-name">${day}</div>`
          ).join('')}</div>`;
        }
        
        renderDays() {
          const year = this.currentDate.getFullYear();
          const month = this.currentDate.getMonth();
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysInPrevMonth = new Date(year, month, 0).getDate();
          
          let html = '<div class="nasjs-dp-days-grid">';
          
          for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<button class="nasjs-dp-day nasjs-dp-day-other" data-action="select" data-day="${day}" data-month="${month - 1}" data-year="${year}">${day}</button>`;
          }
          
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isToday(date);
            const isSelected = this.isSelected(date);
            const isDisabled = this.isDisabled(date);
            
            const classes = [
              'nasjs-dp-day',
              isToday ? 'nasjs-dp-today' : '',
              isSelected ? 'nasjs-dp-selected' : '',
              isDisabled ? 'nasjs-dp-disabled' : ''
            ].filter(Boolean).join(' ');
            
            html += `<button class="${classes}" data-action="select" data-day="${day}" data-month="${month}" data-year="${year}" ${isDisabled ? 'disabled' : ''}>${day}</button>`;
          }
          
          const remainingCells = 42 - (firstDay + daysInMonth);
          for (let day = 1; day <= remainingCells; day++) {
            html += `<button class="nasjs-dp-day nasjs-dp-day-other" data-action="select" data-day="${day}" data-month="${month + 1}" data-year="${year}">${day}</button>`;
          }
          
          html += '</div>';
          return html;
        }
        
        attachPickerEvents() {
          this.picker.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.target.closest('[data-action]');
            if (!target) return;
            
            const action = target.dataset.action;
            
            switch (action) {
              case 'prev':
                this.changeMonth(-1);
                break;
              case 'next':
                this.changeMonth(1);
                break;
              case 'today':
                this.selectToday();
                break;
              case 'clear':
                this.clearDate();
                break;
              case 'select':
                this.selectDate(
                  parseInt(target.dataset.year),
                  parseInt(target.dataset.month),
                  parseInt(target.dataset.day)
                );
                break;
            }
          });
          
          this.picker.querySelector('.nasjs-dp-month').addEventListener('change', (e) => {
            this.currentDate.setMonth(parseInt(e.target.value));
            this.render();
          });
          
          this.picker.querySelector('.nasjs-dp-year').addEventListener('change', (e) => {
            this.currentDate.setFullYear(parseInt(e.target.value));
            this.render();
          });
        }
        
        changeMonth(delta) {
          this.currentDate.setMonth(this.currentDate.getMonth() + delta);
          this.render();
        }
        
        selectDate(year, month, day) {
          const date = new Date(year, month, day);
          if (this.isDisabled(date)) return;
          
          this.selectedDate = date;
          if (this.activeInput) {
            this.activeInput.value = this.formatDate(date);
            this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          if (this.config.onSelect) {
            this.config.onSelect(date, this.activeInput);
          }
          
          this.hide();
        }
        
        selectToday() {
          const today = new Date();
          this.currentDate = new Date(today);
          this.selectDate(today.getFullYear(), today.getMonth(), today.getDate());
        }
        
        clearDate() {
          this.selectedDate = null;
          if (this.activeInput) {
            this.activeInput.value = '';
            this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          this.hide();
        }
        
        isToday(date) {
          const today = new Date();
          return date.toDateString() === today.toDateString();
        }
        
        isSelected(date) {
          if (!this.selectedDate) return false;
          return date.toDateString() === this.selectedDate.toDateString();
        }
        
        isDisabled(date) {
          if (this.config.minDate && date < new Date(this.config.minDate)) {
            return true;
          }
          if (this.config.maxDate && date > new Date(this.config.maxDate)) {
            return true;
          }
          return false;
        }
        
        formatDate(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          
          return this.config.format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
        }
        
        parseDate(dateStr) {
          const parts = dateStr.match(/\d+/g);
          if (!parts || parts.length < 3) return null;
          
          if (this.config.format === 'DD-MM-YYYY' || this.config.format === 'DD/MM/YYYY') {
            return new Date(parts[2], parts[1] - 1, parts[0]);
          }
          
          return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        
        refresh() {
          this.attachToInputs();
        }
        
        destroy() {
          if (this.picker && this.picker.parentNode) {
            this.picker.parentNode.removeChild(this.picker);
          }
        }
      }
      
      return new DatePicker(config);
    },
    
    /**
     * TimePicker Component - Simple Dropdown Version
     */
    timePicker: function(options = {}) {
      const defaults = {
        selector: '.timepicker-input',
        format: '12', // '12' or '24'
        interval: 30, // 15, 30, 60 (1 hour), or 120 (2 hours) minutes
        onSelect: null
      };
      
      const config = { ...defaults, ...options };
      
      class SimpleTimePicker {
        constructor(config) {
          this.config = config;
          this.activeInput = null;
          this.picker = null;
          this.init();
        }
        
        init() {
          this.createPicker();
          this.attachToInputs();
          this.attachGlobalEvents();
        }
        
        createPicker() {
          this.picker = document.createElement('div');
          this.picker.className = 'nasjs-timepicker-simple';
          this.picker.style.display = 'none';
          document.body.appendChild(this.picker);
        }
        
        attachToInputs() {
          const inputs = document.querySelectorAll(this.config.selector);
          inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.style.cursor = 'pointer';
            input.addEventListener('click', (e) => {
              e.stopPropagation();
              this.show(input);
            });
          });
        }
        
        attachGlobalEvents() {
          document.addEventListener('click', (e) => {
            if (!e.target.closest('.nasjs-timepicker-simple') && 
                !e.target.closest(this.config.selector)) {
              this.hide();
            }
          });
          
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
          });
        }
        
        generateTimeOptions() {
          const times = [];
          const interval = this.config.interval;
          
          for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += interval) {
              if (this.config.format === '12') {
                const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                const period = h < 12 ? 'AM' : 'PM';
                const timeStr = `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
                times.push({ value: `${h}:${m}`, display: timeStr });
              } else {
                const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                times.push({ value: timeStr, display: timeStr });
              }
            }
          }
          
          return times;
        }
        
        show(input) {
          this.activeInput = input;
          this.render();
          this.position(input);
          this.picker.style.display = 'block';
          setTimeout(() => this.picker.classList.add('nasjs-visible'), 10);
        }
        
        hide() {
          this.picker.classList.remove('nasjs-visible');
          setTimeout(() => {
            this.picker.style.display = 'none';
          }, 200);
        }
        
        position(input) {
          const rect = input.getBoundingClientRect();
          this.picker.style.top = `${rect.bottom + window.scrollY + 5}px`;
          this.picker.style.left = `${rect.left + window.scrollX}px`;
          
          setTimeout(() => {
            const pickerRect = this.picker.getBoundingClientRect();
            if (pickerRect.right > window.innerWidth) {
              this.picker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
            }
          }, 0);
        }
        
        render() {
          const times = this.generateTimeOptions();
          const currentValue = this.activeInput ? this.activeInput.value : '';
          
          this.picker.innerHTML = `
            <div class="nasjs-tp-simple-header">
              <span>Select Time</span>
              <button class="nasjs-tp-simple-close">×</button>
            </div>
            <div class="nasjs-tp-simple-body">
              <select class="nasjs-tp-simple-select" size="8">
                <option value="">-- Select Time --</option>
                ${times.map(time => 
                  `<option value="${time.display}" ${currentValue === time.display ? 'selected' : ''}>
                    ${time.display}
                  </option>`
                ).join('')}
              </select>
            </div>
            <div class="nasjs-tp-simple-footer">
              <button class="nasjs-tp-simple-btn" data-action="now">Now</button>
              <button class="nasjs-tp-simple-btn" data-action="clear">Clear</button>
            </div>
          `;
          
          this.attachPickerEvents();
        }
        
        attachPickerEvents() {
          const select = this.picker.querySelector('.nasjs-tp-simple-select');
          const closeBtn = this.picker.querySelector('.nasjs-tp-simple-close');
          
          select.addEventListener('change', (e) => {
            if (e.target.value) {
              this.selectTime(e.target.value);
            }
          });
          
          select.addEventListener('dblclick', (e) => {
            if (e.target.value) {
              this.selectTime(e.target.value);
            }
          });
          
          closeBtn.addEventListener('click', () => this.hide());
          
          this.picker.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            
            const action = target.dataset.action;
            
            if (action === 'now') {
              this.selectNow();
            } else if (action === 'clear') {
              this.clearTime();
            }
          });
        }
        
        selectTime(timeStr) {
          if (this.activeInput) {
            this.activeInput.value = timeStr;
            this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          if (this.config.onSelect) {
            this.config.onSelect(timeStr, this.activeInput);
          }
          
          this.hide();
        }
        
        selectNow() {
          const now = new Date();
          const interval = this.config.interval;
          
          const minutes = Math.round(now.getMinutes() / interval) * interval;
          const hours = minutes >= 60 ? (now.getHours() + 1) % 24 : now.getHours();
          const roundedMinutes = minutes % 60;
          
          let timeStr;
          if (this.config.format === '12') {
            const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            const period = hours < 12 ? 'AM' : 'PM';
            timeStr = `${String(hour12).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')} ${period}`;
          } else {
            timeStr = `${String(hours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
          }
          
          this.selectTime(timeStr);
        }
        
        clearTime() {
          if (this.activeInput) {
            this.activeInput.value = '';
            this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          this.hide();
        }
        
        refresh() {
          this.attachToInputs();
        }
        
        destroy() {
          if (this.picker && this.picker.parentNode) {
            this.picker.parentNode.removeChild(this.picker);
          }
        }
      }
      
      return new SimpleTimePicker(config);
    },
    
    /**
     * Live Clock Component
     */
    liveClock: function(selector, options = {}) {
      const defaults = {
        format: '12',
        showSeconds: true,
        showDate: false
      };
      
      const config = { ...defaults, ...options };
      const element = typeof selector === 'string' 
        ? document.querySelector(selector) 
        : selector;
      
      if (!element) {
        console.error('NASjs.liveClock: Element not found');
        return null;
      }
      
      const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        let timeStr = '';
        
        if (config.format === '12') {
          const period = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;
          if (config.showSeconds) timeStr += `:${seconds}`;
          timeStr += ` ${period}`;
        } else {
          timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;
          if (config.showSeconds) timeStr += `:${seconds}`;
        }
        
        if (config.showDate) {
          const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          timeStr += ` - ${dateStr}`;
        }
        
        element.textContent = timeStr;
      };
      
      updateClock();
      const intervalId = setInterval(updateClock, 1000);
      
      return {
        stop: () => clearInterval(intervalId),
        start: () => {
          updateClock();
          return setInterval(updateClock, 1000);
        }
      };
    },
    
    /**
     * Modal Component
     */
    modal: function(options = {}) {
      const defaults = {
        title: 'Modal Title',
        content: '',
        buttons: [
          { text: 'OK', class: 'nasjs-modal-btn-primary', onClick: null }
        ],
        closeOnBackdrop: true,
        closeOnEscape: true,
        onOpen: null,
        onClose: null
      };
      
      const config = { ...defaults, ...options };
      
      const backdrop = document.createElement('div');
      backdrop.className = 'nasjs-modal-backdrop';
      
      const modal = document.createElement('div');
      modal.className = 'nasjs-modal';
      
      modal.innerHTML = `
        <div class="nasjs-modal-content">
          <div class="nasjs-modal-header">
            <h3 class="nasjs-modal-title">${config.title}</h3>
            <button class="nasjs-modal-close">×</button>
          </div>
          <div class="nasjs-modal-body">
            ${config.content}
          </div>
          <div class="nasjs-modal-footer">
            ${config.buttons.map((btn, index) => 
              `<button class="nasjs-modal-btn ${btn.class || ''}" data-index="${index}">${btn.text}</button>`
            ).join('')}
          </div>
        </div>
      `;
      
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
      
      setTimeout(() => backdrop.classList.add('nasjs-visible'), 10);
      
      if (config.onOpen) config.onOpen();
      
      const close = () => {
        backdrop.classList.remove('nasjs-visible');
        setTimeout(() => {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
          if (config.onClose) config.onClose();
        }, 300);
      };
      
      modal.querySelector('.nasjs-modal-close').addEventListener('click', close);
      
      if (config.closeOnBackdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) close();
        });
      }
      
      if (config.closeOnEscape) {
        const escapeHandler = (e) => {
          if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', escapeHandler);
          }
        };
        document.addEventListener('keydown', escapeHandler);
      }
      
      config.buttons.forEach((btn, index) => {
        const btnElement = modal.querySelector(`[data-index="${index}"]`);
        btnElement.addEventListener('click', () => {
          if (btn.onClick) btn.onClick();
          if (btn.close !== false) close();
        });
      });
      
      return { close };
    },
    
    /**
     * Confirm Dialog Component
     * Modern replacement for SweetAlert - lightweight confirmation dialogs
     */
    confirm: function(options = {}) {
      const defaults = {
        title: 'Confirm',
        message: 'Are you sure?',
        confirmText: 'Yes',
        cancelText: 'No',
        onConfirm: null,
        onCancel: null
      };

      const config = { ...defaults, ...options };

      return this.modal({
        title: config.title,
        content: `<p class="nasjs-confirm-message">${config.message}</p>`,
        buttons: [
          {
            text: config.cancelText,
            class: 'nasjs-modal-btn-secondary',
            onClick: () => {
              if (config.onCancel) config.onCancel();
            }
          },
          {
            text: config.confirmText,
            class: 'nasjs-modal-btn-danger',
            onClick: () => {
              if (config.onConfirm) config.onConfirm();
            }
          }
        ],
        closeOnBackdrop: false,
        closeOnEscape: true
      });
    },

    /**
     * Event Calendar Component
     * Full calendar view with event display and popup details
     */
    eventCalendar: function(options = {}) {
      const defaults = {
        selector: '#calendar',
        events: [],
        eventsUrl: null,
        dateField: 'date',
        titleField: 'title',
        descriptionField: 'description',
        colorField: 'color',
        defaultColor: '#3b82f6',
        onEventClick: null,
        onDateClick: null,
        onMonthChange: null,
        renderEventPopup: null,
        popupFields: null,
        showEventCount: true,
        maxEventsPerDay: 3
      };

      const config = { ...defaults, ...options };

      class EventCalendar {
        constructor(config) {
          this.config = config;
          this.currentDate = new Date();
          this.events = [];
          this.container = typeof config.selector === 'string'
            ? document.querySelector(config.selector)
            : config.selector;

          if (!this.container) {
            console.error('NASjs.eventCalendar: Container not found');
            return;
          }

          this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          this.init();
        }

        async init() {
          this.container.classList.add('nasjs-calendar');
          await this.loadEvents();
          this.render();
        }

        async loadEvents() {
          if (this.config.eventsUrl) {
            try {
              const response = await fetch(this.config.eventsUrl);
              const data = await response.json();
              this.events = Array.isArray(data) ? data : (data.events || data.data || []);
            } catch (error) {
              console.error('Failed to load events:', error);
              this.events = this.config.events || [];
            }
          } else {
            this.events = this.config.events || [];
          }
        }

        getEventsForDate(date) {
          const dateStr = this.formatDateStr(date);
          return this.events.filter(event => {
            const eventDate = event[this.config.dateField];
            return eventDate === dateStr || eventDate?.startsWith(dateStr);
          });
        }

        formatDateStr(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        render() {
          const year = this.currentDate.getFullYear();
          const month = this.currentDate.getMonth();

          this.container.innerHTML = `
            <div class="nasjs-cal-header">
              <button class="nasjs-cal-nav" data-action="prev">‹</button>
              <div class="nasjs-cal-title">
                <span class="nasjs-cal-month">${this.months[month]}</span>
                <span class="nasjs-cal-year">${year}</span>
              </div>
              <button class="nasjs-cal-nav" data-action="next">›</button>
            </div>
            <div class="nasjs-cal-days-header">
              ${this.days.map(day => `<div class="nasjs-cal-day-name">${day}</div>`).join('')}
            </div>
            <div class="nasjs-cal-grid">
              ${this.renderDays()}
            </div>
          `;

          this.attachEvents();
        }

        renderDays() {
          const year = this.currentDate.getFullYear();
          const month = this.currentDate.getMonth();
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysInPrevMonth = new Date(year, month, 0).getDate();
          const today = new Date();

          let html = '';

          // Previous month days
          for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="nasjs-cal-cell nasjs-cal-other-month">
              <div class="nasjs-cal-date">${day}</div>
            </div>`;
          }

          // Current month days
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const events = this.getEventsForDate(date);
            const hasEvents = events.length > 0;

            html += `
              <div class="nasjs-cal-cell ${isToday ? 'nasjs-cal-today' : ''} ${hasEvents ? 'nasjs-cal-has-events' : ''}"
                   data-date="${this.formatDateStr(date)}">
                <div class="nasjs-cal-date">${day}</div>
                ${this.renderCellEvents(events)}
              </div>
            `;
          }

          // Next month days
          const totalCells = firstDay + daysInMonth;
          const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
          for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="nasjs-cal-cell nasjs-cal-other-month">
              <div class="nasjs-cal-date">${day}</div>
            </div>`;
          }

          return html;
        }

        renderCellEvents(events) {
          if (events.length === 0) return '';

          const maxShow = this.config.maxEventsPerDay;
          const visibleEvents = events.slice(0, maxShow);
          const remaining = events.length - maxShow;

          let html = '<div class="nasjs-cal-events">';

          visibleEvents.forEach(event => {
            const color = event[this.config.colorField] || this.config.defaultColor;
            const title = event[this.config.titleField] || 'Event';
            html += `<div class="nasjs-cal-event" style="background-color: ${color};"
                         data-event-id="${event.id || ''}" title="${title}">
              ${title}
            </div>`;
          });

          if (remaining > 0) {
            html += `<div class="nasjs-cal-more">+${remaining} more</div>`;
          }

          html += '</div>';
          return html;
        }

        attachEvents() {
          // Navigation
          this.container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const action = e.target.dataset.action;
              if (action === 'prev') this.changeMonth(-1);
              if (action === 'next') this.changeMonth(1);
            });
          });

          // Event clicks
          this.container.querySelectorAll('.nasjs-cal-event').forEach(el => {
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              const cell = el.closest('.nasjs-cal-cell');
              const dateStr = cell.dataset.date;
              const events = this.getEventsForDate(new Date(dateStr));
              const eventId = el.dataset.eventId;
              const event = events.find(ev => String(ev.id) === eventId) || events[0];

              if (this.config.onEventClick) {
                this.config.onEventClick(event, el);
              } else {
                this.showEventPopup(event);
              }
            });
          });

          // Date clicks
          this.container.querySelectorAll('.nasjs-cal-cell:not(.nasjs-cal-other-month)').forEach(cell => {
            cell.addEventListener('click', (e) => {
              if (e.target.closest('.nasjs-cal-event')) return;
              const dateStr = cell.dataset.date;
              const events = this.getEventsForDate(new Date(dateStr));

              if (this.config.onDateClick) {
                this.config.onDateClick(new Date(dateStr), events);
              } else if (events.length > 0) {
                this.showDayEventsPopup(new Date(dateStr), events);
              }
            });
          });
        }

        changeMonth(delta) {
          this.currentDate.setMonth(this.currentDate.getMonth() + delta);
          this.render();

          if (this.config.onMonthChange) {
            this.config.onMonthChange(this.currentDate);
          }
        }

        showEventPopup(event) {
          let content = '';

          if (this.config.renderEventPopup) {
            content = this.config.renderEventPopup(event);
          } else if (this.config.popupFields) {
            content = '<div class="nasjs-event-popup-content">';
            this.config.popupFields.forEach(field => {
              const label = field.label || field.key;
              const value = event[field.key] || '';
              content += `<div class="nasjs-event-field">
                <strong>${label}:</strong> <span>${value}</span>
              </div>`;
            });
            content += '</div>';
          } else {
            const title = event[this.config.titleField] || 'Event';
            const desc = event[this.config.descriptionField] || '';
            const date = event[this.config.dateField] || '';

            content = `
              <div class="nasjs-event-popup-content">
                <div class="nasjs-event-field"><strong>Date:</strong> ${date}</div>
                ${desc ? `<div class="nasjs-event-field"><strong>Description:</strong> ${desc}</div>` : ''}
              </div>
            `;
          }

          NASjs.modal({
            title: event[this.config.titleField] || 'Event Details',
            content: content,
            buttons: [
              { text: 'Close', class: 'nasjs-modal-btn-primary' }
            ]
          });
        }

        showDayEventsPopup(date, events) {
          const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          let content = `<div class="nasjs-day-events">`;
          events.forEach(event => {
            const color = event[this.config.colorField] || this.config.defaultColor;
            const title = event[this.config.titleField] || 'Event';
            const desc = event[this.config.descriptionField] || '';

            content += `
              <div class="nasjs-day-event-item" style="border-left-color: ${color};">
                <div class="nasjs-day-event-title">${title}</div>
                ${desc ? `<div class="nasjs-day-event-desc">${desc}</div>` : ''}
              </div>
            `;
          });
          content += '</div>';

          NASjs.modal({
            title: dateStr,
            content: content,
            buttons: [
              { text: 'Close', class: 'nasjs-modal-btn-primary' }
            ]
          });
        }

        // Public methods
        addEvent(event) {
          this.events.push(event);
          this.render();
        }

        removeEvent(eventId) {
          this.events = this.events.filter(e => e.id !== eventId);
          this.render();
        }

        setEvents(events) {
          this.events = events;
          this.render();
        }

        async refreshEvents() {
          await this.loadEvents();
          this.render();
        }

        goToDate(date) {
          this.currentDate = new Date(date);
          this.render();
        }

        goToToday() {
          this.currentDate = new Date();
          this.render();
        }
      }

      return new EventCalendar(config);
    },

    /**
     * Image Gallery Component
     * Modern popup gallery with navigation, zoom, and thumbnail support
     */
    imageGallery: function(options = {}) {
      const defaults = {
        selector: '[data-nasjs-gallery]',
        groupBy: 'gallery',
        enableZoom: true,
        enableKeyboard: true,
        showThumbnails: true,
        showCounter: true,
        closeOnBackdrop: true,
        animationDuration: 300,
        zoomLevel: 2,
        onOpen: null,
        onClose: null,
        onChange: null
      };

      const config = { ...defaults, ...options };

      class ImageGallery {
        constructor(config) {
          this.config = config;
          this.galleries = {};
          this.currentGallery = null;
          this.currentIndex = 0;
          this.isZoomed = false;
          this.overlay = null;

          this.init();
        }

        init() {
          this.collectImages();
          this.attachEvents();
        }

        collectImages() {
          const elements = document.querySelectorAll(this.config.selector);

          elements.forEach((el, index) => {
            const groupName = el.dataset.gallery || el.dataset.nasjsGallery || 'default';
            const imageUrl = el.dataset.imageUrl || el.dataset.fullsize || el.href || el.src;
            const thumbnail = el.src || el.querySelector('img')?.src || imageUrl;
            const title = el.dataset.title || el.title || el.alt || '';
            const description = el.dataset.description || '';

            if (!this.galleries[groupName]) {
              this.galleries[groupName] = [];
            }

            this.galleries[groupName].push({
              element: el,
              imageUrl: imageUrl,
              thumbnail: thumbnail,
              title: title,
              description: description,
              index: this.galleries[groupName].length
            });
          });
        }

        attachEvents() {
          Object.values(this.galleries).flat().forEach(item => {
            item.element.style.cursor = 'pointer';
            item.element.addEventListener('click', (e) => {
              e.preventDefault();
              const groupName = item.element.dataset.gallery || item.element.dataset.nasjsGallery || 'default';
              this.open(groupName, item.index);
            });
          });
        }

        open(galleryName, index = 0) {
          this.currentGallery = this.galleries[galleryName];
          this.currentIndex = index;

          if (!this.currentGallery || this.currentGallery.length === 0) return;

          this.createOverlay();
          this.showImage(index);

          document.body.style.overflow = 'hidden';

          if (this.config.onOpen) {
            this.config.onOpen(this.currentGallery[index]);
          }
        }

        createOverlay() {
          this.overlay = document.createElement('div');
          this.overlay.className = 'nasjs-gallery-overlay';

          const gallery = this.currentGallery;
          const showThumbs = this.config.showThumbnails && gallery.length > 1;

          this.overlay.innerHTML = `
            <div class="nasjs-gallery-container">
              <button class="nasjs-gallery-close" aria-label="Close">&times;</button>

              ${gallery.length > 1 ? `
                <button class="nasjs-gallery-nav nasjs-gallery-prev" aria-label="Previous">‹</button>
                <button class="nasjs-gallery-nav nasjs-gallery-next" aria-label="Next">›</button>
              ` : ''}

              <div class="nasjs-gallery-content">
                <div class="nasjs-gallery-image-wrapper">
                  <img class="nasjs-gallery-image" src="" alt="">
                  ${this.config.enableZoom ? `
                    <button class="nasjs-gallery-zoom" aria-label="Zoom">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/>
                        <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="2"/>
                        <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  ` : ''}
                </div>
                <div class="nasjs-gallery-info">
                  <div class="nasjs-gallery-title"></div>
                  <div class="nasjs-gallery-description"></div>
                </div>
              </div>

              ${this.config.showCounter && gallery.length > 1 ? `
                <div class="nasjs-gallery-counter">
                  <span class="nasjs-gallery-current">1</span> / <span class="nasjs-gallery-total">${gallery.length}</span>
                </div>
              ` : ''}

              ${showThumbs ? `
                <div class="nasjs-gallery-thumbnails">
                  ${gallery.map((item, i) => `
                    <div class="nasjs-gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                      <img src="${item.thumbnail}" alt="${item.title}">
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `;

          document.body.appendChild(this.overlay);

          // Animate in
          setTimeout(() => this.overlay.classList.add('nasjs-visible'), 10);

          this.attachOverlayEvents();
        }

        attachOverlayEvents() {
          // Close button
          this.overlay.querySelector('.nasjs-gallery-close').addEventListener('click', () => this.close());

          // Navigation
          const prevBtn = this.overlay.querySelector('.nasjs-gallery-prev');
          const nextBtn = this.overlay.querySelector('.nasjs-gallery-next');

          if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
          if (nextBtn) nextBtn.addEventListener('click', () => this.next());

          // Thumbnails
          this.overlay.querySelectorAll('.nasjs-gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
              this.showImage(parseInt(thumb.dataset.index));
            });
          });

          // Zoom
          const zoomBtn = this.overlay.querySelector('.nasjs-gallery-zoom');
          if (zoomBtn) {
            zoomBtn.addEventListener('click', () => this.toggleZoom());
          }

          // Backdrop click
          if (this.config.closeOnBackdrop) {
            this.overlay.addEventListener('click', (e) => {
              if (e.target === this.overlay || e.target.classList.contains('nasjs-gallery-container')) {
                this.close();
              }
            });
          }

          // Keyboard
          if (this.config.enableKeyboard) {
            this.keyHandler = (e) => {
              if (e.key === 'Escape') this.close();
              if (e.key === 'ArrowLeft') this.prev();
              if (e.key === 'ArrowRight') this.next();
            };
            document.addEventListener('keydown', this.keyHandler);
          }

          // Image click for zoom
          const img = this.overlay.querySelector('.nasjs-gallery-image');
          img.addEventListener('click', (e) => {
            if (this.config.enableZoom) {
              e.stopPropagation();
              this.toggleZoom();
            }
          });
        }

        showImage(index) {
          if (index < 0) index = this.currentGallery.length - 1;
          if (index >= this.currentGallery.length) index = 0;

          this.currentIndex = index;
          const item = this.currentGallery[index];

          const img = this.overlay.querySelector('.nasjs-gallery-image');
          const title = this.overlay.querySelector('.nasjs-gallery-title');
          const desc = this.overlay.querySelector('.nasjs-gallery-description');
          const counter = this.overlay.querySelector('.nasjs-gallery-current');

          // Reset zoom
          this.isZoomed = false;
          img.classList.remove('zoomed');

          // Update image
          img.src = item.imageUrl;
          img.alt = item.title;

          // Update info
          title.textContent = item.title;
          desc.textContent = item.description;

          // Update counter
          if (counter) counter.textContent = index + 1;

          // Update thumbnails
          this.overlay.querySelectorAll('.nasjs-gallery-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
          });

          if (this.config.onChange) {
            this.config.onChange(item, index);
          }
        }

        prev() {
          this.showImage(this.currentIndex - 1);
        }

        next() {
          this.showImage(this.currentIndex + 1);
        }

        toggleZoom() {
          const img = this.overlay.querySelector('.nasjs-gallery-image');
          this.isZoomed = !this.isZoomed;
          img.classList.toggle('zoomed', this.isZoomed);

          if (this.isZoomed) {
            img.style.transform = `scale(${this.config.zoomLevel})`;
            img.style.cursor = 'zoom-out';
          } else {
            img.style.transform = '';
            img.style.cursor = 'zoom-in';
          }
        }

        close() {
          if (!this.overlay) return;

          this.overlay.classList.remove('nasjs-visible');

          setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
              this.overlay.parentNode.removeChild(this.overlay);
            }
            this.overlay = null;
            document.body.style.overflow = '';

            if (this.keyHandler) {
              document.removeEventListener('keydown', this.keyHandler);
            }

            if (this.config.onClose) {
              this.config.onClose();
            }
          }, this.config.animationDuration);
        }

        // Public methods
        refresh() {
          this.galleries = {};
          this.collectImages();
          this.attachEvents();
        }

        openGallery(galleryName, index = 0) {
          this.open(galleryName, index);
        }
      }

      return new ImageGallery(config);
    },

    /**
     * Searchable Dropdown Component
     * Features: Remote JSON, Add button with popup, Rich item templates, RTL support
     *
     * @example Basic usage:
     * NASjs.dropdown({
     *   selector: '#my-dropdown',
     *   data: [{ id: 1, name: 'Item 1' }]
     * });
     *
     * @example Remote JSON:
     * NASjs.dropdown({
     *   selector: '#my-dropdown',
     *   remoteUrl: '/api/items',
     *   remoteSearchParam: 'q',
     *   valueKey: 'id',
     *   labelKey: 'name'
     * });
     *
     * @example With Add button and rich template:
     * NASjs.dropdown({
     *   selector: '#my-dropdown',
     *   data: [...],
     *   addButton: true,
     *   addButtonLabel: 'Add New Item',
     *   onAddClick: () => { ... },
     *   template: 'rich',
     *   titleKey: 'name',
     *   subtitleKey: 'description',
     *   statusKey: 'status'
     * });
     */
    dropdown: function(options = {}) {
      const defaults = {
        selector: '.nasjs-dropdown',
        placeholder: 'Select an option...',
        searchPlaceholder: 'Search...',
        noResultsText: 'No results found',
        loadingText: 'Loading...',

        // Data options
        data: [],                    // Static data array
        valueKey: 'id',              // Key for value
        labelKey: 'name',            // Key for display label

        // Remote JSON options
        remoteUrl: null,             // URL to fetch data from
        remoteSearchParam: 'search', // Query parameter for search
        remoteMethod: 'GET',         // HTTP method
        remoteHeaders: {},           // Additional headers
        remoteDataKey: 'data',       // Key in response containing array (null for root array)
        minSearchLength: 0,          // Minimum characters to trigger remote search
        debounceDelay: 300,          // Debounce delay for remote search

        // Add button options
        addButton: false,            // Show add button
        addButtonLabel: 'Add New',   // Button label
        addButtonIcon: '+',          // Button icon
        onAddClick: null,            // Callback when add button clicked

        // Rich template options
        template: 'default',         // 'default' or 'rich'
        titleKey: 'name',            // Key for title in rich template
        subtitleKey: 'subtitle',     // Key for subtitle in rich template
        statusKey: 'status',         // Key for status in rich template
        imageKey: 'image',           // Key for image in rich template

        // Style customization
        styles: {
          width: null,               // Custom width
          maxHeight: '300px',        // Max dropdown height
          itemPadding: null,         // Custom item padding
          fontSize: null,            // Custom font size
          borderRadius: null,        // Custom border radius
          theme: 'light'             // 'light' or 'dark'
        },

        // RTL and language support
        rtl: 'auto',                 // 'auto', true, or false
        direction: null,             // Force direction: 'ltr' or 'rtl'

        // Callbacks
        onSelect: null,              // (item, instance) => {}
        onChange: null,              // (value, item, instance) => {}
        onOpen: null,                // (instance) => {}
        onClose: null,               // (instance) => {}
        onSearch: null,              // (query, instance) => {}
        onLoad: null,                // (data, instance) => {}
        onError: null,               // (error, instance) => {}

        // Animation
        animationDuration: 200
      };

      const config = { ...defaults, ...options };
      if (options.styles) {
        config.styles = { ...defaults.styles, ...options.styles };
      }

      class Dropdown {
        constructor(config) {
          this.config = config;
          this.isOpen = false;
          this.data = [...config.data];
          this.filteredData = [...this.data];
          this.selectedItem = null;
          this.selectedValue = null;
          this.searchQuery = '';
          this.debounceTimer = null;
          this.isLoading = false;
          this.instances = [];
          this.init();
        }

        init() {
          const elements = typeof this.config.selector === 'string'
            ? document.querySelectorAll(this.config.selector)
            : [this.config.selector];

          elements.forEach(element => {
            this.createDropdown(element);
          });
        }

        // Detect RTL based on content or document
        detectRTL(element) {
          if (this.config.direction) {
            return this.config.direction === 'rtl';
          }
          if (this.config.rtl === true) return true;
          if (this.config.rtl === false) return false;

          // Auto-detect from element or document
          const computedStyle = window.getComputedStyle(element);
          if (computedStyle.direction === 'rtl') return true;

          // Check document direction
          const docDir = document.documentElement.getAttribute('dir') ||
                        document.body.getAttribute('dir') ||
                        document.documentElement.style.direction ||
                        document.body.style.direction;
          return docDir === 'rtl';
        }

        // Check if text contains RTL characters (Arabic, Hebrew, etc.)
        containsRTL(text) {
          if (!text) return false;
          const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
          return rtlRegex.test(text);
        }

        createDropdown(element) {
          const isRTL = this.detectRTL(element);
          const wrapper = document.createElement('div');
          wrapper.className = `nasjs-dropdown-wrapper${isRTL ? ' nasjs-rtl' : ''}`;
          wrapper.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

          // Apply custom styles
          if (this.config.styles.width) {
            wrapper.style.width = this.config.styles.width;
          }
          if (this.config.styles.theme === 'dark') {
            wrapper.classList.add('nasjs-dropdown-dark');
          }

          // Hidden input for form submission
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = element.getAttribute('name') || element.id || '';
          hiddenInput.className = 'nasjs-dropdown-value';

          // Main trigger button
          const trigger = document.createElement('div');
          trigger.className = 'nasjs-dropdown-trigger';
          trigger.setAttribute('tabindex', '0');
          trigger.setAttribute('role', 'combobox');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.setAttribute('aria-haspopup', 'listbox');

          if (this.config.styles.borderRadius) {
            trigger.style.borderRadius = this.config.styles.borderRadius;
          }
          if (this.config.styles.fontSize) {
            trigger.style.fontSize = this.config.styles.fontSize;
          }

          const selectedText = document.createElement('span');
          selectedText.className = 'nasjs-dropdown-selected';
          selectedText.textContent = this.config.placeholder;

          const arrow = document.createElement('span');
          arrow.className = 'nasjs-dropdown-arrow';
          arrow.innerHTML = '&#9662;';

          trigger.appendChild(selectedText);
          trigger.appendChild(arrow);

          // Dropdown panel
          const panel = document.createElement('div');
          panel.className = 'nasjs-dropdown-panel';
          panel.style.maxHeight = this.config.styles.maxHeight;
          panel.style.display = 'none';
          panel.setAttribute('role', 'listbox');

          if (this.config.styles.borderRadius) {
            panel.style.borderRadius = this.config.styles.borderRadius;
          }

          // Search input
          const searchWrapper = document.createElement('div');
          searchWrapper.className = 'nasjs-dropdown-search-wrapper';

          const searchInput = document.createElement('input');
          searchInput.type = 'text';
          searchInput.className = 'nasjs-dropdown-search';
          searchInput.placeholder = this.config.searchPlaceholder;
          searchInput.setAttribute('aria-label', 'Search');

          searchWrapper.appendChild(searchInput);

          // Add button (if enabled)
          if (this.config.addButton) {
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'nasjs-dropdown-add-btn';
            addBtn.innerHTML = `<span class="nasjs-dropdown-add-icon">${this.config.addButtonIcon}</span><span>${this.config.addButtonLabel}</span>`;
            addBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (this.config.onAddClick) {
                this.config.onAddClick(this);
              }
            });
            searchWrapper.appendChild(addBtn);
          }

          // Items container
          const itemsContainer = document.createElement('div');
          itemsContainer.className = 'nasjs-dropdown-items';

          // Loading indicator
          const loadingEl = document.createElement('div');
          loadingEl.className = 'nasjs-dropdown-loading';
          loadingEl.textContent = this.config.loadingText;
          loadingEl.style.display = 'none';

          // No results message
          const noResultsEl = document.createElement('div');
          noResultsEl.className = 'nasjs-dropdown-no-results';
          noResultsEl.textContent = this.config.noResultsText;
          noResultsEl.style.display = 'none';

          panel.appendChild(searchWrapper);
          panel.appendChild(loadingEl);
          panel.appendChild(itemsContainer);
          panel.appendChild(noResultsEl);

          wrapper.appendChild(hiddenInput);
          wrapper.appendChild(trigger);
          wrapper.appendChild(panel);

          // Replace original element
          element.parentNode.insertBefore(wrapper, element);
          element.style.display = 'none';

          // Store instance data
          const instanceData = {
            wrapper,
            trigger,
            panel,
            searchInput,
            itemsContainer,
            loadingEl,
            noResultsEl,
            hiddenInput,
            selectedText,
            originalElement: element,
            isRTL
          };

          this.instances.push(instanceData);

          // Attach events
          this.attachEvents(instanceData);

          // Initial render
          this.renderItems(instanceData);

          // Load remote data if URL provided and no static data
          if (this.config.remoteUrl && this.data.length === 0) {
            this.loadRemoteData('', instanceData);
          }
        }

        attachEvents(instance) {
          const { trigger, panel, searchInput, wrapper } = instance;

          // Toggle dropdown
          trigger.addEventListener('click', () => {
            if (this.isOpen) {
              this.close(instance);
            } else {
              this.open(instance);
            }
          });

          // Keyboard navigation
          trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
              e.preventDefault();
              if (!this.isOpen) {
                this.open(instance);
              }
            } else if (e.key === 'Escape') {
              this.close(instance);
            }
          });

          // Search input
          searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            this.searchQuery = query;

            if (this.config.onSearch) {
              this.config.onSearch(query, this);
            }

            if (this.config.remoteUrl) {
              // Debounced remote search
              clearTimeout(this.debounceTimer);
              if (query.length >= this.config.minSearchLength) {
                this.debounceTimer = setTimeout(() => {
                  this.loadRemoteData(query, instance);
                }, this.config.debounceDelay);
              } else if (query.length === 0) {
                this.loadRemoteData('', instance);
              }
            } else {
              // Local filtering
              this.filterLocalData(query, instance);
            }
          });

          searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              this.close(instance);
              trigger.focus();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              const firstItem = instance.itemsContainer.querySelector('.nasjs-dropdown-item');
              if (firstItem) firstItem.focus();
            }
          });

          // Close on outside click
          document.addEventListener('click', (e) => {
            if (this.isOpen && !wrapper.contains(e.target)) {
              this.close(instance);
            }
          });
        }

        open(instance) {
          const { panel, searchInput, trigger } = instance;

          this.isOpen = true;
          panel.style.display = 'block';
          trigger.setAttribute('aria-expanded', 'true');
          trigger.classList.add('nasjs-dropdown-open');

          setTimeout(() => {
            panel.classList.add('nasjs-dropdown-panel-open');
            searchInput.focus();
          }, 10);

          if (this.config.onOpen) {
            this.config.onOpen(this);
          }
        }

        close(instance) {
          const { panel, trigger, searchInput } = instance;

          this.isOpen = false;
          panel.classList.remove('nasjs-dropdown-panel-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.classList.remove('nasjs-dropdown-open');

          setTimeout(() => {
            panel.style.display = 'none';
            searchInput.value = '';
            this.searchQuery = '';
            this.filteredData = [...this.data];
            this.renderItems(instance);
          }, this.config.animationDuration);

          if (this.config.onClose) {
            this.config.onClose(this);
          }
        }

        filterLocalData(query, instance) {
          const lowerQuery = query.toLowerCase();

          this.filteredData = this.data.filter(item => {
            const label = String(item[this.config.labelKey] || '').toLowerCase();
            const title = String(item[this.config.titleKey] || '').toLowerCase();
            const subtitle = String(item[this.config.subtitleKey] || '').toLowerCase();

            return label.includes(lowerQuery) ||
                   title.includes(lowerQuery) ||
                   subtitle.includes(lowerQuery);
          });

          this.renderItems(instance);
        }

        async loadRemoteData(query, instance) {
          const { loadingEl, noResultsEl, itemsContainer } = instance;

          this.isLoading = true;
          loadingEl.style.display = 'block';
          noResultsEl.style.display = 'none';
          itemsContainer.innerHTML = '';

          try {
            let url = this.config.remoteUrl;

            if (this.config.remoteMethod === 'GET') {
              const separator = url.includes('?') ? '&' : '?';
              url = `${url}${separator}${this.config.remoteSearchParam}=${encodeURIComponent(query)}`;
            }

            const fetchOptions = {
              method: this.config.remoteMethod,
              headers: {
                'Content-Type': 'application/json',
                ...this.config.remoteHeaders
              }
            };

            if (this.config.remoteMethod === 'POST') {
              fetchOptions.body = JSON.stringify({
                [this.config.remoteSearchParam]: query
              });
            }

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Extract data from response
            let data = this.config.remoteDataKey ? result[this.config.remoteDataKey] : result;

            if (!Array.isArray(data)) {
              data = [];
            }

            this.data = data;
            this.filteredData = [...data];

            if (this.config.onLoad) {
              this.config.onLoad(data, this);
            }

          } catch (error) {
            console.error('NASjs Dropdown: Error loading remote data', error);
            this.data = [];
            this.filteredData = [];

            if (this.config.onError) {
              this.config.onError(error, this);
            }
          } finally {
            this.isLoading = false;
            loadingEl.style.display = 'none';
            this.renderItems(instance);
          }
        }

        renderItems(instance) {
          const { itemsContainer, noResultsEl, isRTL } = instance;

          itemsContainer.innerHTML = '';

          if (this.filteredData.length === 0 && !this.isLoading) {
            noResultsEl.style.display = 'block';
            return;
          }

          noResultsEl.style.display = 'none';

          this.filteredData.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'nasjs-dropdown-item';
            itemEl.setAttribute('role', 'option');
            itemEl.setAttribute('tabindex', '0');
            itemEl.dataset.index = index;
            itemEl.dataset.value = item[this.config.valueKey];

            // Check for RTL content
            const label = item[this.config.labelKey] || '';
            if (this.containsRTL(label)) {
              itemEl.classList.add('nasjs-item-rtl');
            }

            if (this.config.styles.itemPadding) {
              itemEl.style.padding = this.config.styles.itemPadding;
            }
            if (this.config.styles.fontSize) {
              itemEl.style.fontSize = this.config.styles.fontSize;
            }

            // Check if selected
            if (this.selectedValue !== null &&
                String(item[this.config.valueKey]) === String(this.selectedValue)) {
              itemEl.classList.add('nasjs-dropdown-item-selected');
              itemEl.setAttribute('aria-selected', 'true');
            }

            // Render based on template
            if (this.config.template === 'rich') {
              itemEl.innerHTML = this.renderRichItem(item);
            } else {
              itemEl.innerHTML = this.renderDefaultItem(item);
            }

            // Click event
            itemEl.addEventListener('click', () => {
              this.selectItem(item, instance);
            });

            // Keyboard navigation
            itemEl.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.selectItem(item, instance);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = itemEl.nextElementSibling;
                if (next) next.focus();
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = itemEl.previousElementSibling;
                if (prev) {
                  prev.focus();
                } else {
                  instance.searchInput.focus();
                }
              } else if (e.key === 'Escape') {
                this.close(instance);
                instance.trigger.focus();
              }
            });

            itemsContainer.appendChild(itemEl);
          });
        }

        renderDefaultItem(item) {
          const label = item[this.config.labelKey] || '';
          return `<span class="nasjs-dropdown-item-label">${this.escapeHtml(label)}</span>`;
        }

        renderRichItem(item) {
          const title = item[this.config.titleKey] || '';
          const subtitle = item[this.config.subtitleKey] || '';
          const status = item[this.config.statusKey] || '';
          const image = item[this.config.imageKey] || '';

          let html = '<div class="nasjs-dropdown-item-rich">';

          if (image) {
            html += `<img src="${this.escapeHtml(image)}" alt="" class="nasjs-dropdown-item-image" />`;
          }

          html += '<div class="nasjs-dropdown-item-content">';
          html += `<div class="nasjs-dropdown-item-title">${this.escapeHtml(title)}</div>`;

          if (subtitle) {
            html += `<div class="nasjs-dropdown-item-subtitle">${this.escapeHtml(subtitle)}</div>`;
          }

          html += '</div>';

          if (status) {
            const statusClass = this.getStatusClass(status);
            html += `<span class="nasjs-dropdown-item-status ${statusClass}">${this.escapeHtml(status)}</span>`;
          }

          html += '</div>';
          return html;
        }

        getStatusClass(status) {
          const statusLower = String(status).toLowerCase();
          if (['active', 'success', 'completed', 'done', 'نشط', 'مكتمل'].includes(statusLower)) {
            return 'nasjs-status-success';
          }
          if (['inactive', 'error', 'failed', 'غير نشط', 'فشل'].includes(statusLower)) {
            return 'nasjs-status-error';
          }
          if (['pending', 'warning', 'processing', 'معلق', 'قيد المعالجة'].includes(statusLower)) {
            return 'nasjs-status-warning';
          }
          return 'nasjs-status-default';
        }

        selectItem(item, instance) {
          const { hiddenInput, selectedText, trigger } = instance;

          this.selectedItem = item;
          this.selectedValue = item[this.config.valueKey];

          hiddenInput.value = this.selectedValue;
          selectedText.textContent = item[this.config.labelKey] || '';
          selectedText.classList.add('nasjs-dropdown-has-value');

          // Check for RTL in selected text
          if (this.containsRTL(selectedText.textContent)) {
            selectedText.classList.add('nasjs-item-rtl');
          } else {
            selectedText.classList.remove('nasjs-item-rtl');
          }

          // Update selected state in items
          this.renderItems(instance);

          this.close(instance);

          if (this.config.onSelect) {
            this.config.onSelect(item, this);
          }

          if (this.config.onChange) {
            this.config.onChange(this.selectedValue, item, this);
          }

          // Trigger change event on hidden input
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        escapeHtml(text) {
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        }

        // Public API methods

        /**
         * Set value programmatically
         * @param {*} value - The value to set
         */
        setValue(value) {
          const item = this.data.find(d => String(d[this.config.valueKey]) === String(value));
          if (item && this.instances.length > 0) {
            this.selectItem(item, this.instances[0]);
          }
        }

        /**
         * Get current value
         * @returns {*} Current selected value
         */
        getValue() {
          return this.selectedValue;
        }

        /**
         * Get current selected item
         * @returns {Object} Current selected item object
         */
        getSelectedItem() {
          return this.selectedItem;
        }

        /**
         * Set data array
         * @param {Array} data - New data array
         */
        setData(data) {
          this.data = data;
          this.filteredData = [...data];
          this.instances.forEach(instance => {
            this.renderItems(instance);
          });
        }

        /**
         * Add single item to data
         * @param {Object} item - Item to add
         * @param {boolean} select - Whether to select the added item
         */
        addItem(item, select = false) {
          this.data.push(item);
          this.filteredData = [...this.data];
          this.instances.forEach(instance => {
            this.renderItems(instance);
          });
          if (select && this.instances.length > 0) {
            this.selectItem(item, this.instances[0]);
          }
        }

        /**
         * Clear selection
         */
        clear() {
          this.selectedItem = null;
          this.selectedValue = null;
          this.instances.forEach(instance => {
            instance.hiddenInput.value = '';
            instance.selectedText.textContent = this.config.placeholder;
            instance.selectedText.classList.remove('nasjs-dropdown-has-value', 'nasjs-item-rtl');
            this.renderItems(instance);
          });
        }

        /**
         * Refresh data from remote URL
         */
        refresh() {
          if (this.config.remoteUrl && this.instances.length > 0) {
            this.loadRemoteData(this.searchQuery, this.instances[0]);
          }
        }

        /**
         * Destroy the dropdown
         */
        destroy() {
          this.instances.forEach(instance => {
            const { wrapper, originalElement } = instance;
            originalElement.style.display = '';
            wrapper.parentNode.removeChild(wrapper);
          });
          this.instances = [];
        }

        /**
         * Open dropdown panel
         */
        openDropdown() {
          if (this.instances.length > 0 && !this.isOpen) {
            this.open(this.instances[0]);
          }
        }

        /**
         * Close dropdown panel
         */
        closeDropdown() {
          if (this.instances.length > 0 && this.isOpen) {
            this.close(this.instances[0]);
          }
        }
      }

      return new Dropdown(config);
    },

    /**
     * Popup/Modal Helper for Dropdown Add functionality
     * Works with existing NASjs.modal or standalone
     *
     * @example
     * const popup = NASjs.popup({
     *   title: 'Add New Item',
     *   content: '<form id="add-form">...</form>',
     *   onConfirm: () => { ... }
     * });
     */
    popup: function(options = {}) {
      const defaults = {
        title: '',
        content: '',
        width: '500px',
        showClose: true,
        showFooter: true,
        confirmText: 'Save',
        cancelText: 'Cancel',
        rtl: 'auto',
        onOpen: null,
        onClose: null,
        onConfirm: null,
        onCancel: null,
        className: ''
      };

      const config = { ...defaults, ...options };

      // Detect RTL
      const isRTL = config.rtl === true ||
                   (config.rtl === 'auto' &&
                    (document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'));

      const overlay = document.createElement('div');
      overlay.className = 'nasjs-popup-overlay';

      const popup = document.createElement('div');
      popup.className = `nasjs-popup ${config.className}${isRTL ? ' nasjs-rtl' : ''}`;
      popup.style.width = config.width;
      popup.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      popup.setAttribute('role', 'dialog');
      popup.setAttribute('aria-modal', 'true');

      // Header
      if (config.title || config.showClose) {
        const header = document.createElement('div');
        header.className = 'nasjs-popup-header';

        if (config.title) {
          const title = document.createElement('h3');
          title.className = 'nasjs-popup-title';
          title.textContent = config.title;
          header.appendChild(title);
        }

        if (config.showClose) {
          const closeBtn = document.createElement('button');
          closeBtn.type = 'button';
          closeBtn.className = 'nasjs-popup-close';
          closeBtn.innerHTML = '&times;';
          closeBtn.setAttribute('aria-label', 'Close');
          closeBtn.addEventListener('click', () => close());
          header.appendChild(closeBtn);
        }

        popup.appendChild(header);
      }

      // Body
      const body = document.createElement('div');
      body.className = 'nasjs-popup-body';

      if (typeof config.content === 'string') {
        body.innerHTML = config.content;
      } else if (config.content instanceof HTMLElement) {
        body.appendChild(config.content);
      }

      popup.appendChild(body);

      // Footer
      if (config.showFooter) {
        const footer = document.createElement('div');
        footer.className = 'nasjs-popup-footer';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'nasjs-popup-btn nasjs-popup-btn-cancel';
        cancelBtn.textContent = config.cancelText;
        cancelBtn.addEventListener('click', () => {
          if (config.onCancel) config.onCancel();
          close();
        });

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'nasjs-popup-btn nasjs-popup-btn-confirm';
        confirmBtn.textContent = config.confirmText;
        confirmBtn.addEventListener('click', () => {
          if (config.onConfirm) {
            const result = config.onConfirm();
            if (result !== false) close();
          } else {
            close();
          }
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
        popup.appendChild(footer);
      }

      overlay.appendChild(popup);

      function open() {
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
          overlay.classList.add('nasjs-popup-visible');
          popup.classList.add('nasjs-popup-visible');
        }, 10);

        if (config.onOpen) config.onOpen(popup, body);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) close();
        });

        // Close on Escape
        const escHandler = (e) => {
          if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', escHandler);
          }
        };
        document.addEventListener('keydown', escHandler);
      }

      function close() {
        overlay.classList.remove('nasjs-popup-visible');
        popup.classList.remove('nasjs-popup-visible');

        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          document.body.style.overflow = '';
          if (config.onClose) config.onClose();
        }, 300);
      }

      // Auto-open
      open();

      return {
        popup,
        body,
        open,
        close,
        getElement: () => popup,
        getBody: () => body
      };
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NASjs;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() { return NASjs; });
  } else {
    global.NASjs = NASjs;
  }
  
})(typeof window !== 'undefined' ? window : this);