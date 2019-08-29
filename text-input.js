import React, {useState} from "react"
import { Input, Button } from 'antd';

const { TextArea } = Input;

export default function (){
    const [text, setText] = useState("");
    
    return (
        <>
        <TextArea rows={4} value={text} onChange={(e)=> setText(e.target.value)} autosize={{minRows: 10}}/>
        <br/>
        <Button onClick={()=>transformText(text, 22)} type="primary">Transform</Button>
        </>
    );
}

function transformText(text, maxLength) {
    const arr = text.split(" ");
    
    let i = 0;
    let newText = "";
    let strTemp = ""; 
    for (i=0; i < arr.length; i++){
        
        if (strTemp.length + arr[i].length < maxLength) {               
            if ((i + 1 < arr.length) && ((strTemp.length + arr[i+1].length < maxLength) || (canHyphenate(arr[i + 1])))) 
            {strTemp+=(arr[i] + " ")} else 
            {
                strTemp+=arr[i];
            };
          
        } else {
            if ( i < arr.length && strTemp.length < maxLength-4 && canHyphenate(arr[i])) 
            {
                const [leftover, rest] = hyphenate(arr[i], maxLength - strTemp.length );
                newText+=(strTemp + leftover + "\n");
              
                console.log((strTemp + leftover + "\n").length);
                strTemp = rest+ " ";

            } else {
                newText+=(strTemp + "\n"); 
                
                console.log((strTemp + "\n").length);
                strTemp = arr[i] + " ";
            }
            
        }
    
    }
    newText+=strTemp;
    console.log(newText);
}
function canHyphenate(str){
    if (str.length < 6) return false; //правило 1
    if (str === str.toUpperCase()) return false; // правило 2
    if (isFinite(str)) return false; //правило 3
    
    return true;
}

function hyphenate(str, num) {
   //num - количество символов, которые могут "влезть" в остаток строки
   
   /*TODO:
    1. не считать знаки препинания при переносе
    2. поправить перенос слов с тире
    3. Сделать вывод не в консоль, а в текстовое окно
    4. вторая часть перенесенного слова не должна начинаться с гласной
    5. сделать интерфейс для изменения максимальной длины строки
    6. реализовать двойной перенос слова длиной > 25 символов
 */

    let leftCharsCount = (str.length - num < 3 ? str.length - 2 : num)

    if (str[leftCharsCount - 1] === "-") {console.log('GOT IT');console.log(str.slice(0, leftCharsCount)); }
    const leftover = (str[leftCharsCount - 1] === "-") ? str.slice(0, leftCharsCount) : str.slice(0, leftCharsCount - 1) + "-";
    const rest = (str[leftCharsCount] === "-") ? str.slice(leftCharsCount + 1) : (str[leftCharsCount - 1] === "-") ?  str.slice(leftCharsCount): str.slice(leftCharsCount - 1);

    return [leftover, rest];
}
/* ПРАВИЛА ПЕРЕНОСА
    1. переносим не менее 3х символов и оставляем не менее 3х символов (не включая символы пунктуации) 
    2. нельзя разбивать абреввиатуры (слово написанное капсом)
    3. числа не разбиваем
    4. если в слове есть дефис, предпочтительно разбивать по дефису (с учетом остальных ограничений)
    5. если в слове есть дефис, то в конце строчки не нужно ставить знак переноса (второй дефис)
    6. убирать пробел в конце каждой строки - строка должна заканчиваться либо \n либо переносом("-")
*/