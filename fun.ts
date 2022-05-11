// 查找<span></span> 張數/會員
let pageRegex = new RegExp(
  /<span onclick="candSwitch\([0-9]*\);"><e><i class="small">[0-9]*.<\/i>.*?<\/e><e>[0-9]*<\/e><\/span>/g
);
let formRegex = new RegExp(/<tr.*?">.*?<\/tr>/g);
let GuestList: any[] = [];
let formList: any[] = [];
let area1: any = document.getElementById("area1");
let area2: any = document.getElementById("area2");
let table = document.getElementsByTagName("tbody")[0];
let originTable = table.innerHTML;
let a1_ok = false; //兩邊表格都有東西
let a2_ok = false; //兩邊表格都有東西
area1?.addEventListener("change", (e: any) => {
  console.log(`正在測試...`);
  GuestList = [];
  table.innerHTML = originTable;
  let Array: string[] = [];
  let regex1 = new RegExp(/<i class="small">[0-9]*/g); //切編號
  let regex2 = new RegExp(/<\/i>.*?(<\/e>)/g); //切姓名
  let regex3 = new RegExp(/<e>[0-9]*<\/e>/g); //切張數
  Array = [...area1.value.matchAll(pageRegex)];
  Array.forEach((e) => {
    // 找到會員了，把html文字拆成object
    let tmp_num: any = e[0].match(regex1);
    let tmp_name: any = e[0].match(regex2);
    let tmp_pagenum: any = e[0].match(regex3);
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

area2?.addEventListener("change", (e: any) => {
  formList = [];
  table.innerHTML = originTable;
  let regex1 = new RegExp(/<td.*?>.*?<\/td>/g); //切<td></td>
  let Array: string[] = [];
  Array = [...area2.value.matchAll(formRegex)];
  Array.forEach((e) => {
    let elementAry: any[] = []; //存放0-15行
    let tmp_table_value = e[0].match(regex1);
    tmp_table_value?.forEach((element, i) => {
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
        } else {
          elementAry.push(Number(x[0]));
          elementAry.push(x[1]);
        }
      } else if (i == 15) {
        // 55,555 賴素幸(總計類型處理)
        let tmp: any = element.match(/[0-9]*,[0-9]*/g);
        if (tmp) {
          element = tmp[0].replace(",", "");
          elementAry.push(element);
        }
      } else {
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

window.onload = function () {};
function combo() {
  table.innerHTML = originTable;
  let total = [0, 0, 0, 0, 0];
  GuestList.forEach((e) => {
    for (var j: number = 1; j <= formList.length - 1; j++) {
      if (formList[j][0] == e.num) {
        e.car = Number(formList[j][2]);
        e.two = Number(formList[j][5]);
        e.three = Number(formList[j][8]);
        e.four = Number(formList[j][11]);
        total[0] += e.pagenum;
        total[1] += e.car;
        total[2] += e.two;
        total[3] += e.three;
        total[4] += e.four;
        let result =
          "<th>" +
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
  let tot = total.map((e) => {
    return Number(e) == Number(e.toFixed(2)) ? e : e.toFixed(2);
  });
  let result =
    "<th>" +
    "" +
    "</th>" +
    "<th>" +
    "總計" +
    "</th>" +
    "<th>" +
    tot[0] +
    "</th>" +
    "<th>" +
    tot[1] +
    "</th>" +
    "<th>" +
    tot[2] +
    "</th>" +
    "<th>" +
    tot[3] +
    "</th>" +
    "<th>" +
    tot[4] +
    "</th>";
  table.innerHTML = table.innerHTML + result;
}
