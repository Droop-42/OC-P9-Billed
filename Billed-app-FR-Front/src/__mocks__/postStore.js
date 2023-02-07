import postStore from "./postStore";

export default {
  get: () => {
    return Promise.resolve({
      data: []
    })
  },
  
  post: async (bill) => {
    const getData = await postStore.get();

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
        },
      ],
    });
  }, 
}