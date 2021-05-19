// ######################################################################################
//------------------Delete Item By ID-----------------------------
let del_btn = document.getElementsByClassName('delModalBtn');
for (const ele of del_btn) {
    ele.addEventListener('click',()=>{
        // console.log(ele);
        // console.log(ele.parentElement.parentElement.firstElementChild.innerText);
        let _id = ele.parentElement.parentElement.firstElementChild.innerText;
        let cusId = document.getElementById('cusId');
        cusId.innerText = _id;
    })
}

// #######################################################################################
//-------------------Full Detail in Modal-----------------------------
let cutomarId = document.getElementsByClassName('cutomarId');
for (const ele of cutomarId) {
    ele.addEventListener('click',()=>{
        let loader = document.getElementsByClassName("dash-loader")[0];
        loader.style.filter = "blur(6px)"
        // console.log(ele.innerText);
        let _id = ele.innerText;
        fetch('/user/fill-customer-data/?id='+_id)
            .then(data=>data.json())
            .then(data=>{      
                // console.log(data);
                let customerDetail = document.getElementsByClassName('detail');
                customerDetail[0].innerText = data.name;
                customerDetail[1].innerText = data.email;
                customerDetail[2].innerText = data.phone;
                customerDetail[3].innerText = data.subject;
                customerDetail[4].innerText = data.massage;
                customerDetail[5].value = data.email;
            
                    loader.style.filter = "none"

            })
    })
}
