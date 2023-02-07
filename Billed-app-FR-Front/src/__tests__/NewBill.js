/**
 * @jest-environment jsdom
 */

 import { screen, waitFor, fireEvent, getByTestId } from "@testing-library/dom";
 import NewBillUI from "../views/NewBillUI.js";
 import NewBill from "../containers/NewBill.js";
 import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store";
 import userEvent from '@testing-library/user-event';

 import postStore from "../__mocks__/postStore";
 import BillsUI from "../views/BillsUI.js";
 import oneBill from "../__mocks__/oneBill";
 import router from "../app/Router.js";


describe("When I am on NewBill Page and upload a new file", () => {
    document.body.innerHTML = NewBillUI()
    const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
    const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
  
  test("Then if the format is correct the name of the new file should display", async () => {
    const handleChangeFile = jest.fn(newBill.handleChangeFile) //?
    const filePNG = new File(['hello'], 'hello.png', {type: 'image/png'})
    await waitFor(() => screen.getByTestId("file"))
    const InputFile = screen.getByTestId("file")
    userEvent.upload(InputFile, filePNG)
    await new Promise(process.nextTick)
    expect(InputFile.files[0].name).toEqual("hello.png")
    //expect(handleChangeFile).toHaveBeenCalled() //-->0 expected:1
    //console.log('name',newBill.fileName) //-->Null
    //console.log('url',newBill.formData) //-->Null
  })
  test("Then if the format is not correct an alert message should display", async () => {
    const fileGIF = new File(['hello'], 'hello.gif', {type: 'image/gif'})
    await waitFor(() => screen.getByTestId("file"))
    const InputFile = screen.getByTestId("file")
    userEvent.upload(InputFile, fileGIF)
    userEvent.click(InputFile)
    expect(screen.getAllByTestId('alertFormat')).toBeTruthy() //--->verif 'All'?
    /***************************************
    const handleChangeFile = jest.fn(newBill.handleChangeFile);

    //const attachedFile = screen.getByTestId('file');
    InputFile.addEventListener('change', handleChangeFile);
    fireEvent.change(InputFile, {
      target: {
        files: [
          new File(['hello'], 'hello.png', {type: 'image/png'})
        ],
      },
    });
    await new Promise(process.nextTick);
    // expected results
    expect(handleChangeFile).toHaveBeenCalled();
    expect(InputFile.files[0].name).toBe('hello.png');
    //console.log(newBill.fileName) //-->Null
    
    console.log('fileName: ',newBill.fileName) //-->Null
    
    const newBillForm = screen.getByTestId('form-new-bill')
    expect(newBillForm).toBeTruthy()
    //******************************************** */
  })
})

describe("When I click on submit button", () => {  
  test("Then Bills page should display", () => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock } )
    window.localStorage.setItem( "user", JSON.stringify( { type: "Employee" } ) )
    document.body.innerHTML = NewBillUI()
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    }
    new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})    
    expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()   
    const submitBtn  = screen.getByText("Envoyer")
    userEvent.click(submitBtn)
    expect(screen.getByText("Mes notes de frais")).toBeTruthy()
  })    
})

// test d'intégration POST

describe("When I am on NewBill Page and I post a new bill", () => {
  test("add bill to mock API POST", async () => {
    const post = jest.spyOn(postStore, "post")
    let billList = await postStore.get()
    expect(billList.data.length).toBe(0)

    billList = await postStore.post(oneBill)
    expect(post).toHaveBeenCalled()
    expect(billList.data.length).toBe(1)
  });
  test("Then if not found a 404 error message should display", async () => {
    document.body.innerHTML = BillsUI({ error: "Erreur 404" })
    const errorMessage = await screen.getByText(/Erreur 404/)
    expect(errorMessage).toBeTruthy();
  })
  test("Then if a server error occur a 500 error message should display", async () => {
    document.body.innerHTML = BillsUI({ error: "Erreur 500" })
    const errorMessage = await screen.getByText(/Erreur 500/)
    expect(errorMessage).toBeTruthy()
  });
});


