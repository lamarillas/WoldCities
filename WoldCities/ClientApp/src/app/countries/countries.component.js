"use strict";
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
exports.CountriesComponent = void 0;
var core_1 = require("@angular/core");
var table_1 = require("@angular/material/table");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var country_service_1 = require("./country.service");
var CountriesComponent = /** @class */ (function () {
    function CountriesComponent(countryService) {
        this.countryService = countryService;
        this.displayedColumns = ['id', 'name', 'iso2', 'iso3', 'totCities'];
        this.defaultPageIndex = 0;
        this.defaultPageSize = 10;
        this.defaultSortColumn = "name";
        this.defaultSortOrder = "asc";
        this.defaultFilterColumn = "name";
        this.filterQuery = null;
        this.filterTextChanged = new rxjs_1.Subject();
    }
    CountriesComponent.prototype.ngOnInit = function () {
        this.loadData(null);
    };
    //debounce filter text changes
    CountriesComponent.prototype.onFilterTextChanged = function (filterText) {
        var _this = this;
        if (this.filterTextChanged.observers.length === 0) {
            this.filterTextChanged
                .pipe(operators_1.debounceTime(1000), operators_1.distinctUntilChanged())
                .subscribe(function (query) {
                _this.loadData(query);
            });
        }
        this.filterTextChanged.next(filterText);
    };
    CountriesComponent.prototype.loadData = function (query) {
        if (query === void 0) { query = null; }
        var pageEvent = new paginator_1.PageEvent();
        pageEvent.pageIndex = this.defaultPageIndex;
        pageEvent.pageSize = this.defaultPageSize;
        if (query) {
            this.filterQuery = query;
        }
        this.getData(pageEvent);
    };
    CountriesComponent.prototype.getData = function (event) {
        var _this = this;
        var sortColumn = (this.sort)
            ? this.sort.active
            : this.defaultSortColumn;
        var sortOrder = (this.sort)
            ? this.sort.direction
            : this.defaultSortOrder;
        var filterColumn = (this.filterQuery)
            ? this.defaultFilterColumn
            : null;
        var filterQuery = (this.filterQuery)
            ? this.filterQuery
            : null;
        this.countryService.getData(event.pageIndex, event.pageSize, sortColumn, sortOrder, filterColumn, filterQuery)
            .subscribe(function (result) {
            _this.paginator.length = result.totalCount;
            _this.paginator.pageIndex = result.pageIndex;
            _this.paginator.pageSize = result.pageSize;
            _this.countries = new table_1.MatTableDataSource(result.data);
        }, function (error) { return console.error(error); });
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: false }),
        __metadata("design:type", paginator_1.MatPaginator)
    ], CountriesComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(sort_1.MatSort, { static: false }),
        __metadata("design:type", sort_1.MatSort)
    ], CountriesComponent.prototype, "sort", void 0);
    CountriesComponent = __decorate([
        core_1.Component({
            selector: 'app-countries',
            templateUrl: './countries.component.html',
            styleUrls: ['./countries.component.css']
        }),
        __metadata("design:paramtypes", [country_service_1.CountryService])
    ], CountriesComponent);
    return CountriesComponent;
}());
exports.CountriesComponent = CountriesComponent;
//# sourceMappingURL=countries.component.js.map