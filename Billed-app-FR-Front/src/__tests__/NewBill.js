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
 import { fileValidation } from "../app/format.js";

 jest.mock("../app/Store", () => mockStore);

describe("When I am on NewBill Page and upload a new file", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock } )
      window.localStorage.setItem( "user", JSON.stringify( { type: "Employee" } ) )
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
    })
  test("Then if the format is correct the name of the new file should display", async () => {
    const filePNG = new File(['hello'], 'hello.png', {type: 'image/png'})
    await waitFor(() => screen.getByTestId("file"))
    const InputFile = screen.getByTestId("file")
    userEvent.upload(InputFile, filePNG)
    expect(InputFile.files[0].name).toEqual("hello.png")
    //expect(screen.getAllByTestId('alertFormat')).not.toBeTruthy() //-->not found: OK!
    //expect(screen.getByText("Uniquement les formats jpeg/jpg/png sont acceptés!")).not.toBeTruthy() //-->not found: OK!
    const valid = fileValidation(filePNG)
    expect(valid).toBeTruthy()
    
  })
  test("Then if the format is not correct an alert message should display", async () => {
    const fileGIF = new File(['hello'], 'hello.gif', {type: 'image/gif'})
    await waitFor(() => screen.getByTestId("file"))
    const InputFile = screen.getByTestId("file")
    userEvent.upload(InputFile, fileGIF)
    userEvent.click(InputFile)
    expect(screen.getByTestId('alertFormat')).toBeTruthy()
    const novalid = fileValidation(fileGIF)
    expect(novalid).not.toBeTruthy()
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
    //expect(screen.getByText("Mes notes de frais")).not.toBeTruthy() // not found -->OK!  
    const submitBtn  = screen.getByText("Envoyer")
    userEvent.click(submitBtn)
    expect(screen.getByText("Mes notes de frais")).toBeTruthy()
  })    
})

// test d'intégration POST
describe("When I am on NewBill Page and I post a new bill", () => {
  test("Then the bill should be addad to the store", async () => {
    const post = jest.spyOn(postStore, "post")
    let billList = await postStore.get()
    expect(billList.data.length).toBe(0)
    billList = await postStore.post(oneBill)
    expect(post).toHaveBeenCalled()
    expect(billList.data.length).toBe(1)
  })
  test("Then if not found (given void bill) a 404 error message should display", async () => {
    await postStore.post('')
    const errorMessage = await screen.getByText(/Erreur 404/)
    expect(errorMessage).toBeTruthy();
  })
  test("Then if a server error occur (given null bill) a 500 error message should display", async () => {
    await postStore.post(null)
    const errorMessage = await screen.getByText(/Erreur 500/)
    expect(errorMessage).toBeTruthy()
  })
})


 /* Other tests ---------
describe("When I am on NewBill Page and upload a new file", () => {
  test("handleChangeFile method should have been called with no error", async () => {
    document.body.innerHTML = "";
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
    window.localStorage.setItem( "user", JSON.stringify({ type: "Employee", email: "test@test.com" }) )
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.NewBill);

    await waitFor(() => screen.getByText(/Envoyer une note de frais/));
    const fileInput = screen.getByTestId("file");
    expect(fileInput).toBeTruthy();

    const mockFile = new File(["test.png"], "test.png", {
        type: "image/png",
    })
    fireEvent.change(fileInput, { target: { files: [mockFile] } } )
    await new Promise(process.nextTick);

    const errDiv = document.querySelector('div[data-testid="alertFormat"]')
    expect(errDiv).not.toBeTruthy()   
  })
//--------------
  test("create new bill and catch a 500 error", async () => {
      document.body.innerHTML = "";
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      const mockConsoleErr = jest.fn();
      Object.defineProperty(window, "console", { value: { error: mockConsoleErr } } ) 
      
      jest.spyOn(mockStore, "bills")
      const error500 = new Error('ERREUR 500')
      mockStore.bills.mockImplementationOnce(() => {
          return {
              create: () => {
                  return Promise.reject(error500)
              }
          }
      })
      window.localStorage.setItem( "user", JSON.stringify({ type: "Employee", email: "test@test.com" } ) )

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByText(/Envoyer une note de frais/));
      const fileInput = screen.getByTestId("file");
      expect(fileInput).toBeTruthy();
//----
      const mockFile = new File(["test.gif"], "test.gif", {
          type: "image/gif",
      });
      fireEvent.change(fileInput, { target: { files: [mockFile] } } )
      await new Promise(process.nextTick);

      expect(console.error).toHaveBeenCalledWith(error500)

//----          
  })

})
*/


