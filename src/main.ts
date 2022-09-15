import {createApp} from 'vue'
import App from './App.vue'
import StatTable from './components/StatTable.vue'
import FormDialog from './components/FormDialog.vue'
// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const cat_table_app = createApp(App)
// app.use(ElementPlus)
cat_table_app.mount('#cat_table')


const stat_table_app = createApp(StatTable)
stat_table_app.mount('#data_chart')

const form_dialog_app = createApp(FormDialog)
form_dialog_app.mount('#form_dialog')