const stream = require('stream');
const os = require('os');

/* ПРАВИЛА ПЕРЕНОСА
    1. переносим не менее 3х символов и оставляем не менее 3х символов (не включая символы пунктуации) 
    2. нельзя разбивать абреввиатуры (слово написанное капсом)
    3. числа не разбиваем
    4. если в слове есть дефис, предпочтительно разбивать по дефису (с учетом остальных ограничений)
    5. если в слове есть дефис, то в конце строчки не нужно ставить знак переноса (второй дефис)
    6. убирать пробел в конце каждой строки - строка должна заканчиваться либо \n либо переносом("-")
*/

/* TODO LIST:
    1. не считать знаки препинания при переносе
    2. поправить перенос слов с тире
    3. Сделать вывод не в консоль, а в текстовое окно
    4. вторая часть перенесенного слова не должна начинаться с гласной
    5. сделать интерфейс для изменения максимальной длины строки
    6. реализовать двойной перенос слова длиной > 25 символов
  */

class LineSplitStream extends stream.Transform {
    constructor(options) {
      super(options);
      this._lineLength = options.lineLength;
      this._buffer = '';
    }

    canHyphenate(str){
        if (str.length < 6) return false; //правило 1
        if (str === str.toUpperCase()) return false; // правило 2
        if (isFinite(str)) return false; //правило 3
        
        return true;
    }

    hyphenate(str, num) {
        //num - количество символов, которые могут "влезть" в остаток строки
                
         let leftCharsCount = (str.length - num < 3 ? str.length - 2 : num)
     
         if (str[leftCharsCount - 1] === "-") {console.log('GOT IT');console.log(str.slice(0, leftCharsCount)); }
         const leftover = (str[leftCharsCount - 1] === "-") ? str.slice(0, leftCharsCount) : str.slice(0, leftCharsCount - 1) + "-";
         const rest = (str[leftCharsCount] === "-") ? str.slice(leftCharsCount + 1) : (str[leftCharsCount - 1] === "-") ?  str.slice(leftCharsCount): str.slice(leftCharsCount - 1);
     
         return [leftover, rest];
     }
     
    _transform(chunk, encoding, callback) {
      let strTemp = '';
      //console.log(chunk.toString().split(/(\s)/));
      console.log(chunk.toString().replace(/ +/g , ' ').split(/( |\r\n)/m)); // '\r\n'
      chunk.toString().replace(/ +/g , ' ').split(/(\s)/).forEach((item, i, arr)=>{
       /*  /\s+/  */
       /*   /([ |\b])/)  */
       if (item===os.EOL) {
        //console.log('-----------EOL-----------');
        this.push(strTemp + os.EOL);
        strTemp='';
       } else if (strTemp.length + item.length < this._lineLength) {               
          /*if ((i + 1 < arr.length) && ((strTemp.length + arr[i+1].length < this._lineLength) || (this.canHyphenate(arr[i + 1])))) 
          {strTemp+=(item + ' ')} else 
          {
              strTemp+=item;
          };
        */
        strTemp+=item;
      } else {
          if ( i < arr.length && strTemp.length < this._lineLength - 4 && this.canHyphenate(item)) 
          {
              const [leftover, rest] = this.hyphenate(item, this._lineLength - strTemp.length );
              
              this.push(strTemp + leftover + os.EOL);
              strTemp = rest; //+ ' ';

          } else {              
              this.push(strTemp + os.EOL);
              strTemp = item;// + ' ';
          }
          
      }
      });
    
      if (strTemp) this.push(strTemp);
      callback();
    }
  /*
    _flush(callback) {
      this.push(strTemp);
      callback(null, data);
    }*/
  }
  
  module.exports = LineSplitStream;
 
