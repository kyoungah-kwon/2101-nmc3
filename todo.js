//form과 input, ul연결
const toDoForm = document.querySelector(".comment"),
    toDoInput = toDoForm.querySelector(".comments"),
    toDoList = document.querySelector(".js-toDoList");


//자주 쓸 값 상수화
const TODOS_LS = "toDos";

//LocalStorage에 저장될 To-Do List 항목을 저장할 배열
let toDos = [];
console.log(toDoForm, toDoInput, toDoList, toDos)

//delBtn의 To-Do List 요소 삭제 기능
function deleteToDo(event){
    const btn = event.target; // 현재 클릭한 버튼의 정보 연결
    const li = btn.parentNode; // 현재 클릭한 버튼의 부모정보 -> 우리는 구조상 <li>내부에 <button>이 있으므로 부모<li>를 연결
    toDoList.removeChild(li); // 찾아낸 li 제거

    /*
    Array의 filter()함수는 Array 요소를 각각 filter()에 전달된 함수에 집어넣어
    함수의 return값이 1(true)이면 배열에 집어넣고
    함수의 return값이 2(false)면 배열에 집어넣지 않는 함수이다.

    아래와 같이 사용하면 배열 각각의 요소 아이디와 현재 찾은 아이디를 비교해서
    같지않으면 cleanToDos배열에 추가하고 같으면 추가하지 않아서 결과적으로 찾아낸 li를 뺀 나머지요소로 구성된 배열을 만들어준다.
    */
    const cleanToDos = toDos.filter(function(toDo){
        return toDo.id !== parseInt(li.id);
    });

    toDos = cleanToDos;

    saveToDos();
}

//LocalStorage에 내용 저장
function saveToDos(){
    /*
    Javascript의 Object형식은 Localstrage에서 이해할 수 없음 -> 서로 알아들을 수 있는 공통된 표현방식 필요
    그렇기에 필요한것이 JSON(JavaScript Object Notation)
    Javascript의 Object를 String형식의 JSON으로 바꾸는것이 JSON.stringify()이고
    String형식의 JSON을 Javascript의 Object로 바꾸는것이 JSON.parse()이다.
    */
    localStorage.setItem(TODOS_LS,JSON.stringify(toDos));
}

//화면에 To-Do List를 보여주는 함수
function paintToDo(text){
    /*
    createElement()는 요소를 새로 만드는 함수이다.
    const li = document.createElement("li"); 를 하게되면 li변수에는 <li></li> 의 html태그를 가지는 객체가 생성된다.
    */
    const li = document.createElement("li");
    const delBtn = document.createElement("button")
    const span = document.createElement("span");
    const newId = toDos.length + 1; //배열의 크기를 이용해 ID를 겹치지 않게 부여하는 역할을 한다.
    delBtn.innerText = "X";
    delBtn.addEventListener("click",deleteToDo); //delBtn을 이용해 클릭시에 요소를 삭제하는 deleteToDo함수를 연결
    span.innerText = text;
    li.id=newId;
    /*
    appendChild()는 자식으로 요소를 추가하는 함수이다.
    li.appendChild(delBtn);를 하게되면 우리가 만든 li요소 하위에 delBtn을 추가하게된다.
    */
    li.appendChild(delBtn); // <li><button>X</button></li>
    li.appendChild(span); // <li><button>X</button><span>text</span></li>
    toDoList.appendChild(li); // <ul class="js-toDoList"><li><button>X</button><span>text</span></li></ul>

    /*
    배열에 저장할 객체를 만들어줌
    왜 객체인가?? -> 데이터를 저장할때 text값만 필요한게 아니라 각각을 구별할 id도 필요,
                     그렇기에 여러값을 key값과 value로 구별할 수 있는 객체로 저장하자!
    우리가 쓰고있는 document와 form을 연결한 toDoForm도 모두 객체이다.
    객체의 내부 요소 접근은 toDoObj.id와 같이 '.'으로 접근
    객체의 내부 요소로 함수도 작성가능하다.
    ex)
        const toDoObj = {
            id: newId,
            text : text,
            print : function(){console.log(text)}
        };

        사용시 -> toDoObj.print();
    */
    const toDoObj = {
        id: newId,
        text : text
    };

    toDos.push(toDoObj);// Array에 toDoObj를 넣어줌
    saveToDos(); //LocalStorage에 내용을 저장하는 saveToDos함수 호출
}

//input의 submit 이벤트
function handleSubmit(event){
    event.preventDefault(); //기본 동작하는 이벤트를 막는것
    const currentValue = toDoInput.value; //input에 적힌 값을 가져옴
    paintToDo(currentValue); //input에 적힌 값을 화면에 보여주는 paintToDo함수 호출
    toDoInput.value = ""; //input의 값을 초기화
}

function init(){
    const loadedToDos = localStorage.getItem(TODOS_LS); // LocalStorage의 내용 불러옴
    if(loadedToDos !== null){ // LocalStorage에 내용이 있을시에 화면에 To-Do List를 보여주도록 만들기
        const parseToDos = JSON.parse(loadedToDos); // LocalStorage에 저장된 JSON 형식의 객체를 JS형식으로 바꿔줌
        /*
        parseToDos는 [{object},{object}]와 같은 배열형식이다.
        forEach(function(a){})는 배열과 같이 사용할 수 있는데, 배열의 요소를 하나하나 파라미터의 함수에 넣어 동작한다.
        parseToDos.forEach(function(toDo){})와 같이 사용하면 parseToDos의 요소 하나하나를 함수에 toDo라는 이름으로 넣어서 동작하게된다.

        꼭 함수가 forEach()내부에서 선언될 필요는 없다.
        ex)
            forEach(a)

            function a(b){
                console.log(b);
            }

        이와같이 외부에서 선언하고 함수의 이름만 전달해줘도 된다.
        */
        parseToDos.forEach(function(toDo){
            paintToDo(toDo.text);
        });
        /*
        forEach를 for문으로 표현하면 다음과 같다.

        for(let i=0;i<parseToDos.length;i++){
            paintToDo(parseToDos[i].text);
        }
        */
    }
    toDoForm.addEventListener("submit",handleSubmit); //input의 submit이벤트를 변경
}

init();