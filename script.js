// /**var a=10;
// var str="jgjg";
// var bool=true;
// var n=null;
// var un;
// var bi=123n;
// var symbol=Symbol("id");
// console.log(typeof a);
// console.log(typeof str);
// console.log(typeof bool);
// console.log(typeof n);
// console.log(typeof bi);
// console.log(typeof symbol);**/
// /*var a=10;
// var b=8;
// console.log(a+b);
// console.log(a-b);
// console.log(a*b);
// console.log(a%b);

// console.log(a<b);
// console.log(a===b);*/
// /*var arr=[1,2,3,4,5];
// console.log(arr);
// console.log(typeof arr);

// var obj={
//     name:"jith",
//     age:19
// }
// console.log(obj);
// console.log(typeof obj);*/
// /*for(let i=0;i<10;i++){
//     console.log(i);
    
// }*/
// /*let mark=80;
// if(mark>=90) console.log("O grade");
// else if(mark>=80) console.log("A grade");
// else if(mark>=70) console.log("B grade");
// else console.log("fail");*/
// //switch
// /*let day=6;
// switch(day){
//     case 1:console.log("Sunday");
//     break;
//     case 2:console.log("Monday");
//     break;
//     case 3:console.log("Tuesday");
//     break;
//     case 4:console.log("wednesday");
//     break;
//     case 5:console.log("Thursday");
//     break;
//     case 6:console.log("Friday");
//     break;
//     case 7:console.log("saturday");

//     default:console.log("invalid day");
    
   
// }
// */

// /*var a=9;
// let result=(a%2==0)?"even":"odd";
// console.log(result);*/
// /*mark=89;
// let result=(mark>=90)?"O g":(mark>=80)?"A g":(mark>=70)?"B g":"fail"

// console.log(result);*/
// /*function add(a,b){
//     console.log(a+b);
// }
// add(10,20);
// var add=(a,b)=>{
//     console.log(a+b);
    
// }
// add()
// */
// //spread operator
// var arr1=[2,3,4];
// var arr2=[...arr1,5,6,7];
// console.log(arr2);
// //Destructuring operator
// var [m1,m2,m3,m4,m5]=[2,3,4,5,6];
// console.log(m1);
// console.log(m2);
// console.log(m3);

// var {name,age,city,marks}={
//     name:"jith",
//     age:20,
//     city:"atp",
//     marks:{
//         m1:90,m2:99
//     }
// }
// console.log(name);
// console.log(age);
// console.log(city);
// console.log(marks);

// //map
 let arr=[1,2,3,4,5];
// var double_arr=arr.map((i)=>(i*2))
// console.log(double_arr);
//filter***
var even=arr.filter((i)=>(i%2===0))
console.log(even);
//reduce****
var total=arr.map((i)=>(i*2)).filter((i)=>(i%2===0)).reduce((sum,i)=>(sum+i),0)
console.log(total);


var name="jith";
console.log(`My name is ${name}`)
arr.forEach((value,index)=>{
    console.log(index,value);
    
})

















