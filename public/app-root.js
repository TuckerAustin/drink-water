import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('app-root')
export class AppRoot extends LitElement {
@state() ounces = 0;
@state() reminderDuration = 0;
@state() timer = null;
@state() remainingTime = 0;

  static get styles() {
    return css`
      h1 {
        font-size: 4rem;
      }

      header {
        display: grid;
        justify-content: center;
        width: 100vw;
        height: 100px;
        background-color: #2196f3;
        background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        color: white;
        font-size: var(--sl-font-size-xxxx-large);
        font-weight: var(--sl-font-weight-bold);
      }

      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: calc(100vh - 100px);
        width: 100vw;
        background-color: #2196f3;
        background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        font-size: 24px;
      }

      p {
        color: #2196f3;
        font-size: var(--sl-font-size-medium);
      }

      sl-icon {
        color: white;
      }

      sl-button {
        padding: var(--sl-spacing-xxx-small)
      }

     sl-label,
     sl-select,
     sl-input {
        color: #2196f3;
      }
    `;
  }

  weightWatch(event) {
    const weight = event.target.value;
    const ounces = weight * 2 / 3;
    this.ounces = ounces.toFixed(2);
  }

  toggleDrawer() {
    const drawer = this.shadowRoot.querySelector('sl-drawer');
    if (drawer.open) drawer.hide();
    else drawer.show();
  }

  reminder() {
   this.timer = setTimeout(() => {
      this.notify();
    }, this.reminderDuration);
    this.toggleDrawer();
    this.countdown();
  }

    notify() {
      clearTimeout(this.timer);
      this.notification = new Notification('Drink Water');
      if (this.showNotifications) {
        this.reminder();
      } else {
        this.clearNotification();
      };
    }

    // convert(mill) {
    //   const minutes = Math.floor(mill / 60000);
    //   const seconds = ((mill % 60000) / 1000).toFixed(0);
    //   return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    // }

    countdown() {
      // const seconds = Math.floor( (t/1000) % 60);
      this.remainingTime = this.reminderDuration; //TODO convert to minutes
      this.countdown = setInterval(() => {
        this.remainingTime = this.seconds - 1000;
      }, 1000);
    }

    clearNotification() {
      this.notification = null;
      clearTimeout(this.timer);
      this.timer = null;
    }
    

  showNotification() {
    if (Notification.permission === 'granted') {
      this.reminder()
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.reminder();
        } else {
          throw new Error('Permission denied');
        }
      }).catch(() => {
        alert('You have not enabled notifications')
      })
    };
  };

  updateReminderDuration(e) {
    this.reminderDuration = e.target.value;
  };

  render() {
    return html`
      <header>
        <div class="toolbar">
          Drink Water
        </div>
      </header>
      <div class="wrapper">
        <sl-drawer label="Settings" class="drawer-overview">
          <sl-input @sl-input="${this.weightWatch}" id="weight" type="text" label="Weight: (lbs)"></sl-input>
          <p>You should drink ${this.ounces} ounces per day</p>
          <sl-form @sl-submit="${this.showNotification}" class="input-validaton-required">
            <sl-select @sl-change="${this.updateReminderDuration}" label="Remind me every:" clearable required>
              <sl-menu-item value="900000">15 Min</sl-menu-item>
              <sl-menu-item value="1800000">30 Min</sl-menu-item>
              <sl-menu-item value="2700000">45 Min</sl-menu-item>
              <sl-menu-item value="3600000">1 Hr</sl-menu-item>
            </sl-select>
            <sl-button type="primary" submit>Set Reminder<sl-icon slot="prefix" name="bell"></sl-icon>
            </sl-button>
          </sl-form>
          <sl-button @click="${this.toggleDrawer}" slot="footer" type="primary">Close</sl-button>
        </sl-drawer>
        ${this.timer ? html` <h2>${this.remainingTime}</h2> <sl-button type="danger" @click="${this.clearNotification}">Stop Drink Reminder</sl-button>
        ` : html`<sl-button @click="${this.toggleDrawer}">Setup Drink Reminder</sl-button>`}
      </div>
    `;
  }
}