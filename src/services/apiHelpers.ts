import endpoints from "./endpoints";
import server from "./index";


export function loginUser({ email, password }: ILoginUserBody) {
  const body = { email, password };
  return server.post(endpoints.login, body, { requiresAuth: false });
}

// register

export function RegisterUser({ username, email, password }: RegisterUserBody) {
  const body = { username, email, password };
  return server.post(endpoints.register, body, { requiresAuth: false });
}

export function UserOtp({ email, otp }: any) {
  const body = { email, otp };
  return server.post(endpoints.verifyEmailOtp, body, { requiresAuth: false });
}

// Grocery Categories
export function getGroceryCategories() {
  return server.get(endpoints.getGroceryCategories, { requiresAuth: true });
}

export function createGroceryCategory(data: any) {
  return server.post(endpoints.createGroceryCategory, data, { requiresAuth: true });
}

export function updateGroceryCategory(id: string, data: any) {
  return server.put(`${endpoints.updateGroceryCategory}/${id}`, data, { requiresAuth: true });
}

export function deleteGroceryCategory(id: string) {
  return server.delete(`${endpoints.deleteGroceryCategory}/${id}`, { requiresAuth: true });
}

// Alcohol Categories
export function getAlcoholCategories() {
  return server.get(endpoints.getAlcoholCategories, { requiresAuth: true });
}

export function createAlcoholCategory(data: any) {
  return server.post(endpoints.createAlcoholCategory, data, { requiresAuth: true });
}

export function updateAlcoholCategory(id: string, data: any) {
  return server.put(`${endpoints.updateAlcoholCategory}/${id}`, data, { requiresAuth: true });
}

export function deleteAlcoholCategory(id: string) {
  return server.delete(`${endpoints.deleteAlcoholCategory}/${id}`, { requiresAuth: true });
}

// Grocery Items
export function getGroceryItems(category: string) {
  return server.get(`${endpoints.getGroceryItems}/${category}`, { requiresAuth: true });
}

export function createGroceryItem(data: FormData) {
  return server.post(endpoints.createGroceryItem, data, { requiresAuth: true });
}

export function updateGroceryItem(id: string, data: FormData) {
  return server.put(`${endpoints.updateGroceryItem}/${id}`, data, { requiresAuth: true });
}

export function deleteGroceryItem(id: string) {
  return server.delete(`${endpoints.deleteGroceryItem}/${id}`, { requiresAuth: true });
}

// Alcohol Items
export function getAlcoholItems(category: string) {
  return server.get(`${endpoints.getAlcoholItems}/${category}`, { requiresAuth: true });
}

export function createAlcoholItem(data: FormData) {
  return server.post(endpoints.createAlcoholItem, data, { requiresAuth: true });
}

export function updateAlcoholItem(id: string, data: FormData) {
  return server.put(`${endpoints.updateAlcoholItem}/${id}`, data, { requiresAuth: true });
}

export function deleteAlcoholItem(id: string) {
  return server.delete(`${endpoints.deleteAlcoholItem}/${id}`, { requiresAuth: true });
}

// syllabus
// export function uploadSyllabus({
//   jobCategory,
//   jobTitle,
//   qualifications,
//   file,
// }: {
//   jobCategory: string;
//   jobTitle: string;
//   qualifications: string;
//   file: File;
// }) {
//   const formData = new FormData();
//   formData.append("jobCategory", jobCategory);
//   formData.append("jobTitle", jobTitle);
//   formData.append("qualifications", qualifications);
//   formData.append("file", file);

//   return server.post(endpoints.Syllabus, formData, {
//     requiresAuth: false,
//   });

// }