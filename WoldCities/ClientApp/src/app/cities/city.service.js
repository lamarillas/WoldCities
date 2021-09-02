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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var base_service_1 = require("../base.service");
var CityService = /** @class */ (function (_super) {
    __extends(CityService, _super);
    function CityService(http, baseUrl) {
        return _super.call(this, http, baseUrl) || this;
    }
    CityService.prototype.getData = function (pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery) {
        var url = this.baseUrl + 'api/Cities';
        var params = new http_1.HttpParams()
            .set("pageIndex", pageIndex.toString())
            .set("pageSize", pageSize.toString())
            .set("sortColumn", sortColumn)
            .set("sortOrder", sortOrder);
        if (filterQuery) {
            params = params
                .set("filterColumn", filterColumn)
                .set("filterQuery", filterQuery);
        }
        return this.http.get(url, { params: params });
    };
    CityService.prototype.get = function (id) {
        var url = this.baseUrl + "api/Cities/" + id;
        return this.http.get(url);
    };
    CityService.prototype.put = function (item) {
        var url = this.baseUrl + "api/Cities" + item.id;
        return this.http.put(url, item);
    };
    CityService.prototype.post = function (item) {
        var url = this.baseUrl + "api/Cities";
        return this.http.post(url, item);
    };
    CityService.prototype.getCountries = function (pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery) {
        var url = this.baseUrl + 'api/Countries';
        var params = new http_1.HttpParams()
            .set("pageIndex", pageIndex.toString())
            .set("pageSize", pageSize.toString())
            .set("sortColumn", sortColumn)
            .set("sortOrder", sortOrder);
        if (filterQuery) {
            params = params
                .set("filterColumn", filterColumn)
                .set("filterQuery", filterQuery);
        }
        return this.http.get(url, { params: params });
    };
    CityService.prototype.isDupeCity = function (item) {
        var url = this.baseUrl + "api/Cities/IsDupeCity";
        return this.http.post(url, item);
    };
    CityService = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __param(1, core_1.Inject('BASE_URL')),
        __metadata("design:paramtypes", [http_1.HttpClient, String])
    ], CityService);
    return CityService;
}(base_service_1.BaseService));
exports.CityService = CityService;
//# sourceMappingURL=city.service.js.map