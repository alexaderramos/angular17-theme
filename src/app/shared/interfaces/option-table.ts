export interface OptionTable {
  id : number;
  name : string;
  icon : string;
  goTo : string;
  callback?: | { (args?:any):void };
  permission : string[];
}
