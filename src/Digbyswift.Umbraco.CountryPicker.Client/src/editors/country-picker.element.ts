import { html, css, nothing, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorUiElement  } from '@umbraco-cms/backoffice/property-editor';
import { countries } from './countries';
import type { Country } from './country.model';

type PickerValue = string | string[] | null;

@customElement('digbyswift-country-picker')
export default class CountryPickerElement extends UmbLitElement implements UmbPropertyEditorUiElement {
    @property({ type: Object })
    public value: PickerValue = null;

    @property({ type: Boolean })
    public readonly = false;

    @property({ type: Boolean })
    public isMultiple = false;

    @state()
    private _isOpen = false;

    @state()
    private _searchTerm = '';

    @state()
    private _workingValue: string[] = [];

    @state()
    private _flagBasePath = '/App_Plugins/Digbyswift.Umbraco.CountryPicker/assets/flags';

    public set config(config: UmbPropertyEditorUiElement['config']) {
        if (!config) return;

        this.isMultiple = config.find(x => x.alias === 'multiple')?.value === true;
    }
    
    private get selectedCodes(): string[] {
        if (Array.isArray(this.value)) {
            return this.value;
        }

        return this.value ? [this.value] : [];
    }

    private get selectedCountries(): Country[] {
        const selected = new Set(this.selectedCodes);

        return countries.filter(country => selected.has(country.code));
    }

    private get filteredCountries(): Country[] {
        const term = this._searchTerm.trim().toLowerCase();

        if (!term) {
            return countries;
        }

        return countries.filter(country =>
            country.name.toLowerCase().includes(term) ||
            country.code.toLowerCase().includes(term) ||
            country.code3.toLowerCase().includes(term)
        );
    }

    private get areFilteredCountriesSelected(): boolean {
        const selected = new Set(this._workingValue);

        return this.filteredCountries.length > 0 &&
            this.filteredCountries.every(country => selected.has(country.code));
    }

    public override render() {
        return html`
            <div class="selected">
                ${this.selectedCountries.length
            ? this.selectedCountries.map(country => this.renderSelectedCountry(country))
            : nothing}
            </div>

            ${this.readonly
                ? nothing
                : !this.selectedCountries.length || this.isMultiple 
                    ? html`
                        <uui-button
                            look="placeholder"
                            label=${this.selectedCountries.length ? 'Add or change countries' : 'Add country'}
                            @click=${this.openPicker}>
                            ${this.selectedCountries.length ? 'Change' : 'Add'}
                        </uui-button>
                    `
                    : nothing}

            ${this._isOpen ? this.renderSidebar() : nothing}
        `;
    }

    private renderSelectedCountry(country: Country) {
        return html`
            <div class="selected-country">
                <img src=${this.getFlagUrl(country.code)} alt="Flag of ${country.name}" loading="lazy" />
                <span>${country.name} <small>(${country.code})</small></span>

                ${this.readonly
            ? nothing
            : html`
                        <uui-button
                            compact
                            look="secondary"
                            label="Remove ${country.name}"
                            @click=${() => this.removeCountry(country.code)}>
                            Remove
                        </uui-button>
                    `}
            </div>
        `;
    }

    private renderSidebar() {
        return html`
            <div class="overlay" @click=${this.closePicker}></div>

            <aside class="sidebar" role="dialog" aria-modal="true" aria-label="Select countries">
                <header>
                    <h3>Select ${this.isMultiple ? 'countries' : 'country'}</h3>

                    <uui-button
                        compact
                        look="secondary"
                        label="Close"
                        @click=${this.closePicker}>
                        Close
                    </uui-button>
                </header>

                <uui-input
                    class="search"
                    label="Search countries"
                    placeholder="Search by name, GB, GBR..."
                    .value=${this._searchTerm}
                    @input=${this.onSearchInput}>
                </uui-input>

                ${this.isMultiple
                    ? html`
                        <div class="bulk-actions">
                            <uui-button
                                compact
                                look="secondary"
                                label=${this.areFilteredCountriesSelected ? 'Clear all' : 'Select all'}
                                @click=${this.toggleFilteredCountries}>
                                ${this.areFilteredCountriesSelected ? 'Clear all' : 'Select all'}
                            </uui-button>
                        </div>
                    `
                    : nothing}

                <div class="list">
                    ${this.filteredCountries.map(country => this.renderCountryOption(country))}
                </div>

                ${this.isMultiple
            ? html`
                        <footer>
                            <span>${this._workingValue.length} selected</span>

                            <div class="footer-actions">
                                <uui-button look="secondary" label="Cancel" @click=${this.closePicker}>
                                    Cancel
                                </uui-button>

                                <uui-button look="primary" color="positive" label="Submit" @click=${this.submitMultiple}>
                                    Submit
                                </uui-button>
                            </div>
                        </footer>
                    `
            : nothing}
            </aside>
        `;
    }

    private renderCountryOption(country: Country) {
        const checked = this._workingValue.includes(country.code);

        return html`
            <button class="country-option" type="button" @click=${() => this.selectCountry(country.code)}>
                ${this.isMultiple
            ? html`<uui-checkbox .checked=${checked}></uui-checkbox>`
            : nothing}

                <img src=${this.getFlagUrl(country.code)} alt="" loading="lazy" />

                <span>${country.name}</span>
                <small>${country.code}</small>
            </button>
        `;
    }

    private getFlagUrl(code: string): string {
        return `${this._flagBasePath}/${code.toLowerCase()}.svg`;
    }

    private openPicker = async () => {
        this._workingValue = [...this.selectedCodes];
        this._searchTerm = '';
        this._isOpen = true;

        await this.updateComplete;
        this.renderRoot.querySelector<HTMLElement>('uui-input.search')?.focus();
    };

    private closePicker = () => {
        this._isOpen = false;
    };

    private onSearchInput = (event: InputEvent) => {
        const input = event.target as HTMLInputElement;
        this._searchTerm = input.value;
    };

    private selectCountry(code: string) {
        if (!this.isMultiple) {
            this.value = code;
            this.dispatchChange();
            this.closePicker();
            return;
        }

        this._workingValue = this._workingValue.includes(code)
            ? this._workingValue.filter(x => x !== code)
            : [...this._workingValue, code];
    }

    private toggleFilteredCountries = () => {
        const filteredCodes = this.filteredCountries.map(country => country.code);

        if (this.areFilteredCountriesSelected) {
            this._workingValue = this._workingValue.filter(code => !filteredCodes.includes(code));
            return;
        }

        this._workingValue = [...new Set([...this._workingValue, ...filteredCodes])];
    };

    private submitMultiple = () => {
        this.value = this._workingValue;
        this.dispatchChange();
        this.closePicker();
    };

    private removeCountry(code: string) {
        if (this.isMultiple) {
            this.value = this.selectedCodes.filter(x => x !== code);
        } else {
            this.value = null;
        }

        this.dispatchChange();
    }

    private dispatchChange() {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
    }

    static styles = css`
        .selected {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-3);
            margin-bottom: var(--uui-size-space-4);
        }

        .empty {
            color: var(--uui-color-text-alt);
        }

        .selected-country,
        .country-option {
            display: grid;
            grid-template-columns: 24px 1fr auto auto;
            align-items: center;
            gap: var(--uui-size-space-3);
        }

        .selected-country {
            padding: var(--uui-size-space-3);
            border: 1px solid var(--uui-color-border);
            border-radius: var(--uui-border-radius);
        }

        img {
            width: 24px;
            height: 18px;
            object-fit: cover;
            border: 1px solid var(--uui-color-border);
        }

        .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 10000;
        }

        .sidebar {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 10001;
            width: 420px;
            max-width: 100vw;
            height: 100vh;
            background: var(--uui-color-surface);
            box-shadow: var(--uui-shadow-depth-5);
            display: flex;
            flex-direction: column;
        }

        header,
        footer {
            padding: var(--uui-size-space-5);
            border-bottom: 1px solid var(--uui-color-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--uui-size-space-4);
        }

        footer {
            border-top: 1px solid var(--uui-color-border);
            border-bottom: 0;
        }

        .footer-actions {
            display: flex;
            gap: var(--uui-size-space-3);
        }

        .search {
            margin: var(--uui-size-space-5);
        }

        .bulk-actions {
            display: flex;
            justify-content: flex-end;
            padding: 0 var(--uui-size-space-5) var(--uui-size-space-4);
        }

        .list {
            overflow: auto;
            padding: 0 var(--uui-size-space-5) var(--uui-size-space-5);
        }

        .country-option {
            width: 100%;
            border: 0;
            background: transparent;
            text-align: right;
            cursor: pointer;
            padding: var(--uui-size-space-3);
            border-radius: var(--uui-border-radius);
            color: var(--uui-color-text);
        }

        .country-option:hover {
            background: var(--uui-color-surface-emphasis);
        }

        small {
            color: var(--uui-color-text-alt);
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'digbyswift-country-picker': CountryPickerElement;
    }
}
