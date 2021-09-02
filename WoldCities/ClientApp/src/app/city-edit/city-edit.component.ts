import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../base.form.component';
import { ApiResult } from '../base.service';
import { City } from '../cities/City';
import { CityService } from '../cities/city.service';
import { Country } from '../countries/country';


@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
/** city-edit component*/
export class CityEditComponent
  extends BaseFormComponent implements OnInit {
  // the view title
  title: string;
  // the form model
  form: FormGroup;
  // the city object to edit
  city: City;
  // the city object id, as fetched from the active route:
  // it´s NULL when we´re adding a new city
  // and not NULL when we´re editing an existing one.
  id?: number;
  // the country array for the select
  //countries: Country[];
  countries: Observable<ApiResult<Country>>;

  //private subscriptions: Subscription = new Subscription();
  private destroySubject: Subject<boolean> = new Subject<boolean>();

  activityLog: string = '';
  /** city-edit ctor */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      lon: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());

    // react to form changes
    this.form.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.form.dirty) {
          this.log("Form Model has been loaded.");
        } else {
          this.log("Form was updated by the user.");
        }
      });

    // react to changes in the form.name control
    this.form.get("name")!.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.form.dirty) {
          this.log("Name has been loaded with initial values.");
        } else {
          this.log("Name was updated by the user.");  
        }
      });

    this.loadData();
  }

  ngOnDestroy() {
    //this.subscriptions.unsubscribe();
    // emit a value with the takeUntil notifier
    this.destroySubject.next(true);
    // unsuscribe from the notifier itself
    this.destroySubject.unsubscribe();
  }

  log(str: string) {
    this.activityLog += "["
      + new Date().toLocaleString()
      + "] " + str + "<br />";
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.get("name").value;
      city.lat = +this.form.get("lat").value;
      city.lon = +this.form.get("lon").value;
      city.countryId = +this.form.get("countryId").value;
      
      return this.cityService.isDupeCity(city).pipe(
          map(result => {
            return (result ? { isDupeCity: true } : null);
          })
      );
    }
  }

  loadData() {
    // load countries
    this.loadCountries();
    //retrieve the ID from the 'id'
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      // EDIT MODE
      //fetch the city from the server
      
      this.cityService.get<City>(this.id).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;
        //update the form with the city value
        this.form.patchValue(this.city);
      }, error => console.log(error));
    } else {
      // ADD NEW MODE
      this.title = "Create a new City";
    }
  }

  loadCountries() {
    // fetch all the countries from the server
    this.countries = this.cityService
      .getCountries<ApiResult<Country>>(
      0,
      9999,
      "name",
      null,
      null,
      null
    );
  }

  onSubmit() {
    var city = (this.id) ? this.city : <City>{};
    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get("countryId").value;
    if (this.id) {
      //EDIT MODE
      this.cityService
        .put<City>(city)
        .subscribe(result => {
          console.log("City " + city.id + " has been updated.");
          // go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.log(error));
    } else {
      // ADD NEW MODE
      this.cityService
        .post<City>(city)
        .subscribe(result => {
          console.log("City" + result.id + " has been created.");
          // go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.log(error));
    }
  }
}
