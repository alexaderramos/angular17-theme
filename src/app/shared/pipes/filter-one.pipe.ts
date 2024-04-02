import { Pipe, PipeTransform } from '@angular/core';
import {DateRange, extendMoment, MomentRange} from "moment-range";
import {Moment} from 'moment';
import * as moment from 'moment-timezone';
import {Column} from "../interfaces/column";
const momentRange: MomentRange = extendMoment(moment);


@Pipe({
  name: 'filterOne',
  standalone: true
})
export class FilterOnePipe implements PipeTransform {

  transform(items: any[],  searchFilter: string, keyFilter: Column, date_range:any = null): any[]{
    if(!items) return [];

    if(date_range){
      if(date_range.start && date_range.end){
        items = items.filter((x)=>{
          if(!x.date) return true;
          let date = new Date(x.date);

          const range: DateRange = momentRange.range(moment(date_range.start), moment(date_range.end));
          const dateRecord = moment(date);

          return  range.contains(dateRecord);

        })
      }
    }

    if(!keyFilter) return items;

    if(!searchFilter) return items;

    let searchFilterNormalize = this.normalizeCase(searchFilter);



    if(keyFilter.second_id !== '')
    {
      return items.filter(x => this.normalizeCase(x[keyFilter.id]?x[keyFilter.id][keyFilter.second_id]:x[keyFilter.id]).includes(searchFilterNormalize));
    }

    return items.filter(x => this.normalizeCase(x[keyFilter.id]).includes(searchFilterNormalize));
  }

  normalizeCase(stringValue: string)
  {
    if(!stringValue) return '';

    return stringValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"") ;
  }

}
