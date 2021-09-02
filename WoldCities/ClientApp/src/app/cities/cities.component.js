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
exports.CitiesComponent = void 0;
var core_1 = require("@angular/core");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var table_1 = require("@angular/material/table");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var city_service_1 = require("./city.service");
var CitiesComponent = /** @class */ (function () {
    /** Cities ctor */
    function CitiesComponent(cityService) {
        this.cityService = cityService;
        this.displayedColumns = ['id', 'name', 'lat', 'lon', 'countryName'];
        this.defaultPageIndex = 0;
        this.defaultPageSize = 10;
        this.defaultSortColumn = "name";
        this.defaultSortOrder = "asc";
        this.defaultFilterColumn = "name";
        this.filterQuery = null;
        this.filterTextChanged = new rxjs_1.Subject();
    }
    CitiesComponent.prototype.ngOnInit = function () {
        this.loadData();
    };
    //debounce filter text changes
    CitiesComponent.prototype.onFilterTextChanged = function (filterText) {
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
    CitiesComponent.prototype.loadData = function (query) {
        if (query === void 0) { query = null; }
        var pageEvent = new paginator_1.PageEvent();
        pageEvent.pageIndex = this.defaultPageIndex;
        pageEvent.pageSize = this.defaultPageSize;
        if (query) {
            this.filterQuery = query;
        }
        this.getData(pageEvent);
    };
    CitiesComponent.prototype.getData = function (event) {
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
        this.cityService.getData(event.pageIndex, event.pageSize, sortColumn, sortOrder, filterColumn, filterQuery)
            .subscribe(function (result) {
            _this.paginator.length = result.totalCount;
            _this.paginator.pageIndex = result.pageIndex;
            _this.paginator.pageSize = result.pageSize;
            _this.cities = new table_1.MatTableDataSource(result.data);
        }, function (error) { return console.log(error); });
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: false }),
        __metadata("design:type", paginator_1.MatPaginator)
    ], CitiesComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(sort_1.MatSort, { static: false }),
        __metadata("design:type", sort_1.MatSort)
    ], CitiesComponent.prototype, "sort", void 0);
    CitiesComponent = __decorate([
        core_1.Component({
            selector: 'app-cities',
            templateUrl: './cities.component.html',
            styleUrls: ['./cities.component.css']
        })
        /** Cities component*/
        ,
        __metadata("design:paramtypes", [city_service_1.CityService])
    ], CitiesComponent);
    return CitiesComponent;
}());
exports.CitiesComponent = CitiesComponent;
//# sourceMappingURL=cities.component.js.map