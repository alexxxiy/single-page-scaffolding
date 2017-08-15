import includeModule,{include1, include2} from './include';
import app from './react_app'

window.onload = function(){
	include1();
	include2();
	includeModule.include3();
};