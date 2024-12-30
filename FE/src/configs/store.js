// import { configureStore } from "@reduxjs/toolkit";
// import selectedIndexReducer from "../features/slices/selectedIndex";
// import modalReducer from "../slices/modalSlice";
// import editLessionReducer from "@/slices/editLessionSlice";
// import adminCourseviewReducer from "@/slices/adminCourseViewSlice";
// import { studentApi } from "../apis/StudentDashboardApi";
// import { instuctorApi } from "@/apis/InstructorDashboardApi";
// import { CourseApi } from "@/apis/CourseApi";
// // import { adminApi } from "@/apis/adminApi";

// export const store = configureStore({
//   reducer: {
//     modal: modalReducer,
//     selectedIndex: selectedIndexReducer,
//     editLession: editLessionReducer,
//     adminCourseView: adminCourseviewReducer,
//     // [adminApi.reducerPath]: adminApi.reducer,
//     [studentApi.reducerPath]: studentApi.reducer,
//     [instuctorApi.reducerPath]: instuctorApi.reducer,
//     [CourseApi.reducerPath]: CourseApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//       .concat(studentApi.middleware)
//       .concat(instuctorApi.middleware)
//       .concat(CourseApi.middleware)
//       // .concat(adminApi.middleware),
// });
