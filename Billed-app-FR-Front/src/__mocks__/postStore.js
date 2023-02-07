import postStore from "./postStore";
import BillsUI from "../views/BillsUI.js";

export default {
  get: () => {
    return Promise.resolve({
      data: []
    })
  },
  
  post: async (bill) => {
    const getData = await postStore.get();
    console.log('bill', bill)
    if (bill=='') {
      return document.body.innerHTML = BillsUI({ error: "Erreur 404" })
      //return Promise.reject(new Error('Erreur 404'))

    } else if (bill== null ) {
      return document.body.innerHTML = BillsUI({ error: "Erreur 500" })
      //return Promise.reject(new Error('Erreur 500'))

    } else{
      return Promise.resolve({
        data: [
          ...getData.data,
          {
            id: bill.id,
            vat: bill.vat,
            fileUrl: bill.fileUrl,
            status: bill.status,
            type: bill.type,
            commentAdmin: bill.commentAdmin,
            name: bill.name,
            fileName: bill.fileName,
            date: bill.date,
            amount: bill.amount,
            email: bill.email,
            pct: bill.pct,
          }
        ]
      })
    }    
  } 
}