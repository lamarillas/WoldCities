"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryEditComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var base_form_component_1 = require("../base.form.component");
var country_service_1 = require("../countries/country.service");
var CountryEditComponent = /** @class */ (function (_super) {
    __extends(CountryEditComponent, _super);
    function CountryEditComponent(fb, activatedRoute, router, countryService) {
        var _this = _super.call(this) || this;
        _this.fb = fb;
        _this.activatedRoute = activatedRoute;
        _this.router = router;
        _this.countryService = countryService;
        return _this;
        //this.loadData();
    }
    CountryEditComponent.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            name: ['',
                forms_1.Validators.required,
                this.isDupeField("name")
            ],
            iso2: ['',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(/^[a-zA-Z]{2}$/)
                ],
                this.isDupeField("iso2")
            ],
            iso3: ['',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(/^[a-zA-Z]{3}$/)
                ],
                this.isDupeField("iso3")
            ]
        });
        this.loadData();
    };
    CountryEditComponent.prototype.loadData = function () {
        var _this = this;
        // retrieve the ID from the 'id'
        this.id = +this.activatedRoute.snapshot.paramMap.get('id');
        if (this.id) {
            // EDIT MODE
            // fetch the country from the server
            this.countryService.get(this.id)
                .subscribe(function (result) {
                _this.country = result;
                _this.title = "Edit - " + _this.country.name;
                // update the form with the country value
                _this.form.patchValue(_this.country);
            }, function (error) { return console.error(error); });
        }
        else {
            // ADD NEW MODE
            this.title = "Create a new Country";
        }
    };
    CountryEditComponent.prototype.onSubmit = function () {
        var _this = this;
        var country = (this.id) ? this.country : {};
        country.name = this.form.get("name").value;
        country.iso2 = this.form.get("iso2").value;
        country.iso3 = this.form.get("iso3").value;
        if (this.id) {
            // EDIT mode
            this.countryService
                .put(country)
                .subscribe(function (result) {
                console.log("Country " + country.id + " has been updated.");
                // go back to cities view
                _this.router.navigate(['/countries']);
            }, function (error) { return console.error(error); });
        }
        else {
            // ADD NEW mode
            this.countryService
                .post(country)
                .subscribe(function (result) {
                console.log("Country " + result.id + " has been created.");
                // go back to cities view
                _this.router.navigate(['/countries']);
            }, function (error) { return console.error(error); });
        }
    };
    CountryEditComponent.prototype.isDupeField = function (fieldName) {
        var _this = this;
        return function (control) {
            var countryId = (_this.id) ? _this.id.toString() : "0";
            return _this.countryService.isDupeField(countryId, fieldName, control.value)
                .pipe(operators_1.map(function (result) {
                return (result ? { isDupeField: true } : null);
            }));
        };
    };
    CountryEditComponent = __decorate([
        core_1.Component({
            selector: 'app-country-edit',
            templateUrl: './country-edit.component.html',
            styleUrls: ['./country-edit.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            router_1.ActivatedRoute,
            router_1.Router,
            country_service_1.CountryService])
    ], CountryEditComponent);
    return CountryEditComponent;
}(base_form_component_1.BaseFormComponent));
exports.CountryEditComponent = CountryEditComponent;
//# sourceMappingURL=country-edit.component.js.map