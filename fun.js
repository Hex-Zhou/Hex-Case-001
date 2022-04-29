"use strict";
// 查找<span></span> 張數/會員
let pageRegex = new RegExp(/<span onclick="candSwitch\([0-9]*\);"><e><i class="small">[0-9]*.<\/i>.*?<\/e><e>[0-9]*<\/e><\/span>/g);
let formRegex = new RegExp(/<tr.*?">.*?<\/tr>/g);
let GuestList = [];
let formList = [];
let area1 = document.getElementById("area1");
let area2 = document.getElementById("area2");
let a1_ok = false; //兩邊表格都有東西
let a2_ok = false; //兩邊表格都有東西
area1 === null || area1 === void 0 ? void 0 : area1.addEventListener("change", (e) => {
    let Array = [];
    let regex1 = new RegExp(/<i class="small">[0-9]*/g); //切編號
    let regex2 = new RegExp(/<\/i>.*?(<\/e>)/g); //切姓名
    let regex3 = new RegExp(/<e>[0-9]*<\/e>/g); //切張數
    Array = [...area1.value.matchAll(pageRegex)];
    Array.forEach((e) => {
        // 找到會員了，把html文字拆成object
        let tmp_num = e[0].match(regex1);
        let tmp_name = e[0].match(regex2);
        let tmp_pagenum = e[0].match(regex3);
        tmp_num = tmp_num[0].replace(`<i class="small">`, "");
        tmp_name = tmp_name[0].replace(`</i>`, "");
        tmp_name = tmp_name.replace(`</e>`, "");
        tmp_pagenum = tmp_pagenum[0].replace("<e>", "");
        tmp_pagenum = tmp_pagenum.replace("</e>", "");
        let obj = { num: Number(tmp_num), name: tmp_name, pagenum: Number(tmp_pagenum) };
        if (obj.pagenum != 0) {
            GuestList.push(obj);
        }
    });
    if (GuestList.length != 0) {
        console.log(`key單 過關`);
    }
    a1_ok = GuestList.length == 0 ? false : true;
    if (a1_ok && a2_ok) {
        combo();
    }
});
area2 === null || area2 === void 0 ? void 0 : area2.addEventListener("change", (e) => {
    let regex1 = new RegExp(/<td.*?>.*?<\/td>/g); //切<td></td>
    let Array = [];
    Array = [...area2.value.matchAll(formRegex)];
    Array.forEach((e) => {
        let elementAry = []; //存放0-15行
        let tmp_table_value = e[0].match(regex1);
        tmp_table_value === null || tmp_table_value === void 0 ? void 0 : tmp_table_value.forEach((element, i) => {
            element = element.replace(/<td.*?>/g, ""); //取代<td>
            element = element.replace("</td>", ""); // 取代 </td>
            element = element.replace(/<span.*?>/g, ""); //取代<td>
            element = element.replace("</span>", ""); //取代<td>
            element = element.replace(/<div.*?>/g, ""); //取代<td>
            element = element.replace("</div>", ""); //取代<td>
            element = element.replace("&nbsp;", ""); //取代 $nbsp;
            if (i == 0) {
                let x = element.split(".");
                if (x[0] == "總計") {
                    elementAry.push(999);
                    elementAry.push(x[0]);
                }
                else {
                    elementAry.push(Number(x[0]));
                    elementAry.push(x[1]);
                }
            }
            else if (i == 15) {
                // 55,555 賴素幸(總計類型處理)
                let tmp = element.match(/[0-9]*,[0-9]*/g);
                if (tmp) {
                    element = tmp[0].replace(",", "");
                    elementAry.push(element);
                }
            }
            else {
                elementAry.push(element);
            }
        });
        formList.push(elementAry);
    });
    if (formList.length != 0) {
        console.log(`報表頁 過關`);
    }
    a2_ok = formList.length == 0 ? false : true;
    if (a1_ok && a2_ok) {
        combo();
    }
});
window.onload = function () {
    alert("專為男同志設計的網站，歡迎使用街口支付贊助我");
};
function combo() {
    let table = document.getElementsByTagName("tbody")[0];
    GuestList.forEach((e, i) => {
        for (var j = 1; j <= formList.length - 1; j++) {
            if (formList[j][0] == e.num) {
                e.car = Number(formList[j][2]);
                e.two = Number(formList[j][5]);
                e.three = Number(formList[j][8]);
                e.four = Number(formList[j][11]);
                let result = "<th>" +
                    e.num +
                    "</th>" +
                    "<th>" +
                    e.name +
                    "</th>" +
                    "<th>" +
                    e.pagenum +
                    "</th>" +
                    "<th>" +
                    e.car +
                    "</th>" +
                    "<th>" +
                    e.two +
                    "</th>" +
                    "<th>" +
                    e.three +
                    "</th>" +
                    "<th>" +
                    e.four +
                    "</th>";
                table.innerHTML = table.innerHTML + result;
            }
        }
    });
}
