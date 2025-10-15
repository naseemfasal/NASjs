/**
 * NASjs - Beautiful, Lightweight UI Components
 * @version 1.0.0
 * @license MIT
 * @author Your Name
 * @description Framework-agnostic UI component library
 */

(function(global) {
  'use strict';

  const NASjs = {
    version: '1.0.0',
    
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
          
          // Previous month days
          for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<button class="nasjs-dp-day nasjs-dp-day-other" data-action="select" data-day="${day}" data-month="${month - 1}" data-year="${year}">${day}</button>`;
          }
          
          // Current month days
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
          
          // Next month days
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
     * TimePicker Component
     */
    timePicker: function(options = {}) {
      const defaults = {
        selector: '.timepicker-input',
        format: '12',
        onSelect: null
      };
      
      const config = { ...defaults, ...options };
      
      class TimePicker {
        constructor(config) {
          this.config = config;
          this.activeInput = null;
          this.picker = null;
          this.hour = 12;
          this.minute = 0;
          this.period = 'AM';
          this.init();
        }
        
        init() {
          this.createPicker();
          this.attachToInputs();
          this.attachGlobalEvents();
        }
        
        createPicker() {
          this.picker = document.createElement('div');
          this.picker.className = 'nasjs-timepicker';
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
            if (!e.target.closest('.nasjs-timepicker') && 
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
            this.parseTime(input.value);
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
          this.picker.innerHTML = `
            <div class="nasjs-tp-container">
              <div class="nasjs-tp-display">
                <div class="nasjs-tp-time">
                  <span class="nasjs-tp-number">${String(this.hour).padStart(2, '0')}</span>
                  <span class="nasjs-tp-separator">:</span>
                  <span class="nasjs-tp-number">${String(this.minute).padStart(2, '0')}</span>
                  ${this.config.format === '12' ? `<span class="nasjs-tp-period">${this.period}</span>` : ''}
                </div>
              </div>
              
              <div class="nasjs-tp-controls">
                <div class="nasjs-tp-column">
                  <button class="nasjs-tp-btn-up" data-action="hour-up">▲</button>
                  <div class="nasjs-tp-value">${String(this.hour).padStart(2, '0')}</div>
                  <button class="nasjs-tp-btn-down" data-action="hour-down">▼</button>
                  <div class="nasjs-tp-label">Hour</div>
                </div>
                
                <div class="nasjs-tp-separator">:</div>
                
                <div class="nasjs-tp-column">
                  <button class="nasjs-tp-btn-up" data-action="minute-up">▲</button>
                  <div class="nasjs-tp-value">${String(this.minute).padStart(2, '0')}</div>
                  <button class="nasjs-tp-btn-down" data-action="minute-down">▼</button>
                  <div class="nasjs-tp-label">Minute</div>
                </div>
                
                ${this.config.format === '12' ? `
                  <div class="nasjs-tp-column">
                    <button class="nasjs-tp-btn-period" data-action="toggle-period">
                      ${this.period}
                    </button>
                  </div>
                ` : ''}
              </div>
              
              <div class="nasjs-tp-footer">
                <button class="nasjs-tp-btn-action" data-action="now">Now</button>
                <button class="nasjs-tp-btn-action" data-action="done">Done</button>
              </div>
            </div>
          `;
          
          this.attachPickerEvents();
        }
        
        attachPickerEvents() {
          this.picker.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.target.closest('[data-action]');
            if (!target) return;
            
            const action = target.dataset.action;
            
            switch (action) {
              case 'hour-up':
                this.hour = this.config.format === '12' 
                  ? (this.hour === 12 ? 1 : this.hour + 1)
                  : (this.hour === 23 ? 0 : this.hour + 1);
                this.render();
                break;
              case 'hour-down':
                this.hour = this.config.format === '12'
                  ? (this.hour === 1 ? 12 : this.hour - 1)
                  : (this.hour === 0 ? 23 : this.hour - 1);
                this.render();
                break;
              case 'minute-up':
                this.minute = this.minute === 59 ? 0 : this.minute + 1;
                this.render();
                break;
              case 'minute-down':
                this.minute = this.minute === 0 ? 59 : this.minute - 1;
                this.render();
                break;
              case 'toggle-period':
                this.period = this.period === 'AM' ? 'PM' : 'AM';
                this.render();
                break;
              case 'now':
                this.setCurrentTime();
                break;
              case 'done':
                this.selectTime();
                break;
            }
          });
        }
        
        setCurrentTime() {
          const now = new Date();
          if (this.config.format === '12') {
            this.hour = now.getHours() % 12 || 12;
            this.period = now.getHours() >= 12 ? 'PM' : 'AM';
          } else {
            this.hour = now.getHours();
          }
          this.minute = now.getMinutes();
          this.render();
        }
        
        selectTime() {
          const timeStr = this.formatTime();
          if (this.activeInput) {
            this.activeInput.value = timeStr;
            this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          if (this.config.onSelect) {
            this.config.onSelect(timeStr, this.activeInput);
          }
          
          this.hide();
        }
        
        formatTime() {
          if (this.config.format === '12') {
            return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')} ${this.period}`;
          } else {
            return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
          }
        }
        
        parseTime(timeStr) {
          const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (match) {
            this.hour = parseInt(match[1]);
            this.minute = parseInt(match[2]);
            if (match[3]) {
              this.period = match[3].toUpperCase();
            }
          }
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
      
      return new TimePicker(config);
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