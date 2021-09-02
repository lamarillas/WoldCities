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
exports.CityEditComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var base_form_component_1 = require("../base.form.component");
var city_service_1 = require("../cities/city.service");
var CityEditComponent = /** @class */ (function (_super) {
    __extends(CityEditComponent, _super);
    /** city-edit ctor */
    function CityEditComponent(activatedRoute, router, cityService) {
        var _this = _super.call(this) || this;
        _this.activatedRoute = activatedRoute;
        _this.router = router;
        _this.cityService = cityService;
        //private subscriptions: Subscription = new Subscription();
        _this.destroySubject = new rxjs_1.Subject();
        _this.activityLog = '';
        return _this;
    }
    CityEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.form = new forms_1.FormGroup({
            name: new forms_1.FormControl('', forms_1.Validators.required),
            lat: new forms_1.FormControl('', [
                forms_1.Validators.required,
                forms_1.Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
            ]),
            lon: new forms_1.FormControl('', [
                forms_1.Validators.required,
                forms_1.Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
            ]),
            countryId: new forms_1.FormControl('', forms_1.Validators.required)
        }, null, this.isDupeCity());
        // react to form changes
        this.form.valueChanges
            .pipe(operators_1.takeUntil(this.destroySubject))
            .subscribe(function () {
            if (!_this.form.dirty) {
                _this.log("Form Model has been loaded.");
            }
            else {
                _this.log("Form was updated by the user.");
            }
        });
        // react to changes in the form.name control
        this.form.get("name").valueChanges
            .pipe(operators_1.takeUntil(this.destroySubject))
            .subscribe(function () {
            if (!_this.form.dirty) {
                _this.log("Name has been loaded with initial values.");
            }
            else {
                _this.log("Name was updated by the user.");
            }
        });
        this.loadData();
    };
    CityEditComponent.prototype.ngOnDestroy = function () {
        //this.subscriptions.unsubscribe();
        // emit a value with the takeUntil notifier
        this.destroySubject.next(true);
        // unsuscribe from the notifier itself
        this.destroySubject.unsubscribe();
    };
    CityEditComponent.prototype.log = function (str) {
        this.activityLog += "["
            + new Date().toLocaleString()
            + "] " + str + "<br />";
    };
    CityEditComponent.prototype.isDupeCity = function () {
        var _this = this;
        return function (control) {
            var city = {};
            city.id = (_this.id) ? _this.id : 0;
            city.name = _this.form.get("name").value;
            city.lat = +_this.form.get("lat").value;
            city.lon = +_this.form.get("lon").value;
            city.countryId = +_this.form.get("countryId").value;
            return _this.cityService.isDupeCity(city).pipe(operators_1.map(function (result) {
                return (result ? { isDupeCity: true } : null);
            }));
        };
    };
    CityEditComponent.prototype.loadData = function () {
        var _this = this;
        // load countries
        this.loadCountries();
        //retrieve the ID from the 'id'
        this.id = +this.activatedRoute.snapshot.paramMap.get('id');
        if (this.id) {
            // EDIT MODE
            //fetch the city from the server
            this.cityService.get(this.id).subscribe(function (result) {
                _this.city = result;
                _this.title = "Edit - " + _this.city.name;
                //update the form with the city value
                _this.form.patchValue(_this.city);
            }, function (error) { return console.log(error); });
        }
        else {
            // ADD NEW MODE
            this.title = "Create a new City";
        }
    };
    CityEditComponent.prototype.loadCountries = function () {
        // fetch all the countries from the server
        this.countries = this.cityService
            .getCountries(0, 9999, "name", null, null, null);
    };
    CityEditComponent.prototype.onSubmit = function () {
        var _this = this;
        var city = (this.id) ? this.city : {};
        city.name = this.form.get("name").value;
        city.lat = +this.form.get("lat").value;
        city.lon = +this.form.get("lon").value;
        city.countryId = +this.form.get("countryId").value;
        if (this.id) {
            //EDIT MODE
            this.cityService
                .put(city)
                .subscribe(function (result) {
                console.log("City " + city.id + " has been updated.");
                // go back to cities view
                _this.router.navigate(['/cities']);
            }, function (error) { return console.log(error); });
        }
        else {
            // ADD NEW MODE
            this.cityService
                .post(city)
                .subscribe(function (result) {
                console.log("City" + result.id + " has been created.");
                // go back to cities view
                _this.router.navigate(['/cities']);
            }, function (error) { return console.log(error); });
        }
    };
    CityEditComponent = __decorate([
        core_1.Component({
            selector: 'app-city-edit',
            templateUrl: './city-edit.component.html',
            styleUrls: ['./city-edit.component.css']
        })
        /** city-edit component*/
        ,
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router,
            city_service_1.CityService])
    ], CityEditComponent);
    return CityEditComponent;
}(base_form_component_1.BaseFormComponent));
exports.CityEditComponent = CityEditComponent;
//# sourceMappingURL=city-edit.component.js.map