<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Опросный лист для оптимального выбора регулирующих клапанов для пароконденсатных систем.");
require 'inc.functions.php';
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Конденсатоотводчик");
$APPLICATION->SetTitle("Опросный лист Регулирующий клапан");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index2.php';
} else {
    ?>
    <style>
        #form td, #form th {
            padding: 10px;
        }
    </style>
    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form" id="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Опросный лист на регулирующий клапан">
        <input type="hidden" name="rand" value="<?= rand() ?>">
        <? foreach ($_GET as $key => $item) {
            ?>
            <input type="hidden" name="<?= $key ?>" value="<?= $item ?>">
            <?
        } ?>
        <div class="alert alert-warning reqwarning" role="alert" style="display: none">
            Пожалуйста заполните выделенные поля - они обязательны.
        </div>

        <div class="alert alert-warning formerror" role="alert" style="display: none">
        </div>

        <div class="form-group">
            <? ob_start(); ?>
            <table class="table">
                <tbody>
                <tr>
                    <td width="30%">
                        <div class="cel-title">Организация:</div>
                    </td>
                    <td width="70%"><input type="text" class="form-control" required placeholder="название компании"
                                           name="COMPANY_TITLE" value="<?= $data['COMPANY_TITLE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Контактное лицо</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="контактное лицо" name="NAME"
                               value="<?= $data['NAME'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Телефон/факс:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="+7 (000) 000-00-00" name="PHONE"
                               value="<?= $data['PHONE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">E-mail:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="Ваш e-mail" name="EMAIL"
                               value="<?= $data['EMAIL'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Город:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="Ваш город" name="CITY"
                               value="<?= $data['CITY'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Количество*, шт:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="Количество*, шт" name="CNT"
                               value="<?= $data['CNT'] ?>"></td>
                </tr>
                </tbody>
            </table>
            <hr>
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td height="45" colspan="5" align="center" valign="middle" bgcolor="#eee"><strong>РАБОЧИЕ
                            УСЛОВИЯ*</strong></td>
                </tr>
                <tr>
                    <td rowspan="4" align="center" valign="middle">
                        Продукт
                    </td>
                </tr>
                <tr>

                    <td align="center" valign="middle">
                        Наименование /состав
                    </td>
                    <td><input type="text" name="form_1" value="<?= $data['form_1'] ?>" class="form-control"></td>
                </tr>
                <tr>

                    <td align="center" valign="middle">
                        Примеси/твердые частицы (концентрация, размеры)
                    </td>
                    <td><input type="text" name="form_2" value="<?= $data['form_2'] ?>" class="form-control"></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">
                        Агрегатное состояние
                    </td>
                    <td>
                        <div class="radio cel-title">
                            <label class="radio-inline">
                                <input type="checkbox" <?= $data['form_4'] == 'Жидкость, м3/ч' ? 'checked' : '' ?>
                                       name="form_4" value="Жидкость, м3/ч">Жидкость, м3/ч
                            </label>
                            <label class="radio-inline">
                                <input type="checkbox" <?= $data['form_5'] == 'Газ нм3 /ч' ? 'checked' : '' ?>
                                       name="form_5" value="Газ нм3 /ч">Газ нм3 /ч
                            </label>
                            <label class="radio-inline">
                                <input type="checkbox" <?= $data['form_6'] == 'Водяной пар кг/ч' ? 'checked' : '' ?>
                                       name="form_6" value="Водяной пар кг/ч">Водяной пар кг/ч
                            </label>
                        </div>
                    </td>
                </tr>
            </table>
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td align="center" valign="middle" bgcolor="#eee">
                        Температура продукта, в рабочем режиме
                    </td>
                    <td bgcolor="#eee" align="center" valign="middle">°С</td>
                    <td bgcolor="#eee"><input type="text" name="form_7" value="<?= $data['form_7'] ?>"
                                              class="form-control"></td>
                </tr>
            </table>
            <table border="1" bordercolor="#ccc" cellspacing="10" width="100%" cellpadding="10">
                <tr>
                    <td colspan="2" align="center" valign="middle"> Режим работы</td>
                    <td></td>
                    <td align="center" valign="middle">I</td>
                    <td align="center" valign="middle">II</td>
                    <td align="center" valign="middle">III</td>
                </tr>
                <tr>
                    <td rowspan="4" align="center" valign="middle">
                        Расход (для газов расход указан при стандартных условиях
                        -20°С, 101,325kPa (ГОСТ2939))
                    </td>
                </tr>
                <tr>
                    <td rowspan="3"></td>
                    <td align="center" valign="middle">Min</td>
                    <td bgcolor="#eee"><input type="text" name="form_7" value="<?= $data['form_7'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_8" value="<?= $data['form_8'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_9" value="<?= $data['form_9'] ?>"
                                              class="form-control"></td>
                </tr>
                <tr>

                    <td align="center" valign="middle">Nom</td>
                    <td bgcolor="#eee"><input type="text" name="form_10" value="<?= $data['form_10'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_11" value="<?= $data['form_11'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_12" value="<?= $data['form_12'] ?>"
                                              class="form-control"></td>
                </tr>
                <tr>

                    <td align="center" valign="middle">Max</td>
                    <td bgcolor="#eee"><input type="text" name="form_13" value="<?= $data['form_13'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_14" value="<?= $data['form_14'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_15" value="<?= $data['form_15'] ?>"
                                              class="form-control"></td>
                </tr>

                <tr>
                    <td align="center" valign="middle">Давление до клапана (избыточное)</td>
                    <td align="center" valign="middle">bar</td>
                    <td align="center" valign="middle"></td>
                    <td bgcolor="#eee"><input type="text" name="form_16" value="<?= $data['form_16'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_17" value="<?= $data['form_17'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_18" value="<?= $data['form_18'] ?>"
                                              class="form-control"></td>
                </tr>

                <tr>
                    <td align="center" valign="middle">Перепад давления</td>
                    <td align="center" valign="middle">bar</td>
                    <td align="center" valign="middle">Max</td>
                    <td bgcolor="#eee"><input type="text" name="form_19" value="<?= $data['form_19'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_20" value="<?= $data['form_20'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_21" value="<?= $data['form_21'] ?>"
                                              class="form-control"></td>
                </tr>

                <tr>
                    <td align="center" valign="middle">Плотность продукта (для газов плотность указана при
                        стандартных условиях -20°С, 101,325kPa (ГОСТ2939))
                    </td>
                    <td align="center" valign="middle">кг/м3</td>
                    <td align="center" valign="middle"></td>
                    <td bgcolor="#eee"><input type="text" name="form_22" value="<?= $data['form_22'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_23" value="<?= $data['form_23'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_24" value="<?= $data['form_24'] ?>"
                                              class="form-control"></td>
                </tr>

                <tr>
                    <td align="center" valign="middle" bgcolor="#eee">Температура окружающей среды</td>
                    <td align="center" valign="middle" bgcolor="#eee">°С</td>
                    <td bgcolor="#eee" colspan="2"><input type="text" name="form_25" value="<?= $data['form_25'] ?>"
                                                          class="form-control" placeholder="Min"></td>
                    <td bgcolor="#eee" colspan="2"><input type="text" name="form_26" value="<?= $data['form_26'] ?>"
                                                          class="form-control" placeholder="MAX"></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">Максимальное давление (избыточное)</td>
                    <td align="center" valign="middle">bar</td>
                    <td bgcolor="#eee" colspan="4"><input type="text" name="form_27" value="<?= $data['form_27'] ?>"
                                                          class="form-control"></td>
                </tr>

                <tr>
                    <td align="center" valign="middle">Максимальная температура продукта</td>
                    <td align="center" valign="middle">bar</td>
                    <td align="center" valign="middle">Max</td>
                    <td bgcolor="#eee"><input type="text" name="form_28" value="<?= $data['form_28'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_29" value="<?= $data['form_29'] ?>"
                                              class="form-control"></td>
                    <td bgcolor="#eee"><input type="text" name="form_30" value="<?= $data['form_30'] ?>"
                                              class="form-control"></td>
                </tr>
            </table>
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td height="45" colspan="2" align="center" valign="middle" bgcolor="#eee">
                        <strong>УСТАНОВКА*</strong></td>
                </tr>
                <tr>
                    <td>Размер трубопровода. Толщина стенки</td>
                    <td bgcolor="#eee"><input type="text" name="form_31" value="<?= $data['form_31'] ?>"
                                              class="form-control" placeholder="Ø х мм"></td>
                </tr>
                <tr>
                    <td>Материал трубопровода</td>
                    <td bgcolor="#eee"><input type="text" name="form_32" value="<?= $data['form_32'] ?>"
                                              class="form-control"></td>
                </tr>
            </table>

            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td height="45" colspan="4" align="center" valign="middle" bgcolor="#eee"><strong>КЛАПАН*</strong>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">
                        Модификация
                    </td>
                    <td rowspan="2">
                        <div class="radio table-cel-title cel-title-30">
                            <input type="radio" name="form_33" <?= $data['form_33'] == 1 ? 'checked' : '' ?> value="1">2-х
                            ходовой<br>
                        </div>
                    </td>
                    <td colspan="2">
                        <div class="radio table-cel-title cel-title-30">
                            <input type="radio" name="form_33" <?= $data['form_33'] == 2 ? 'checked' : '' ?> value="2">3-х
                            ходовой
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="radio required-radio cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="form_34" <?= $data['form_34'] == 1 ? 'checked' : '' ?>
                                       value="1">Смешивание
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="form_34" <?= $data['form_34'] == 2 ? 'checked' : '' ?>
                                       value="2">Разделение
                            </label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>Номинальный диаметр, DN</td>
                    <td>мм</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_35" value="<?= $data['form_35'] ?>"
                                                          class="form-control"></td>
                </tr>
                <tr>
                    <td>Номинальное давление, PN</td>
                    <td>bar</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_36" value="<?= $data['form_36'] ?>"
                                                          class="form-control"></td>
                </tr>

                <tr>
                    <td colspan="2">Класс по ANSI</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_37" value="<?= $data['form_37'] ?>"
                                                          class="form-control"></td>
                </tr>

                <tr>
                    <td>Пропускная способность, Kvs**</td>
                    <td>м3/ч</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_38" value="<?= $data['form_38'] ?>"
                                                          class="form-control"></td>
                </tr>

                <tr>
                    <td>Назначение клапана</td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_39"
                                   value="1" <?= $data['form_39'] == 1 ? 'checked' : '' ?>>Регулирование
                        </label>
                    </td>
                    <td colspan="2">
                        <label class="radio-inline">
                            <input type="checkbox" name="form_40"
                                   value="1" <?= $data['form_40'] == 1 ? 'checked' : '' ?>>Открыт/закрыт
                        </label>
                    </td>
                </tr>

                <tr>
                    <td>Пропускная характеристика</td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_41"
                                   value="1" <?= $data['form_41'] == 1 ? 'checked' : '' ?>>Равнопроцентная
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_42"
                                   value="1" <?= $data['form_42'] == 1 ? 'checked' : '' ?>>Линейная
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_43"
                                   value="1" <?= $data['form_43'] == 1 ? 'checked' : '' ?>>Запорная
                        </label>
                    </td>
                </tr>

                <tr>
                    <td>Положение при отсутствии питания</td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_44"
                                   value="1" <?= $data['form_44'] == 1 ? 'checked' : '' ?>>Открыт
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_45"
                                   value="1" <?= $data['form_45'] == 1 ? 'checked' : '' ?>>Закрыт
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="checkbox" name="form_46"
                                   value="1" <?= $data['form_46'] == 1 ? 'checked' : '' ?>>Сохраняет положение
                        </label>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">Класс герметичности</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_47" value="<?= $data['form_47'] ?>"
                                                          class="form-control"></td>
                </tr>


                <tr>
                    <td colspan="2">Уплотнение штока плунжера</td>
                    <td colspan="2">
                        <div class="radio required-radio cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="form_48" <?= $data['form_48'] == 1 ? 'checked' : '' ?>
                                       value="1">Сальник (стандарт)
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="form_48" <?= $data['form_48'] == 2 ? 'checked' : '' ?>
                                       value="2">Сильфон
                            </label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">Способ монтажа</td>
                    <td colspan="2">
                        <div class="radio required-radio cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="form_49" <?= $data['form_49'] == 1 ? 'checked' : '' ?>
                                       value="1">Фланцевый
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="form_49" <?= $data['form_49'] == 2 ? 'checked' : '' ?>
                                       value="2">Под приварку
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="form_49" <?= $data['form_49'] == 3 ? 'checked' : '' ?>
                                       value="3">Резьбовой
                            </label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">Уплотнение затвора</td>
                    <td colspan="2">
                        <div class="radio required-radio cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="form_50" <?= $data['form_50'] == 1 ? 'checked' : '' ?>
                                       value="1">Металл по металлу (стандарт)
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="form_50" <?= $data['form_50'] == 2 ? 'checked' : '' ?>
                                       value="2">Мягкое уплотнение (PTFE)
                            </label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">Форма уплотнительной поверхности фланцев</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_51" value="<?= $data['form_51'] ?>"
                                                          class="form-control"></td>
                </tr>

                <tr>
                    <td colspan="2">Материал корпуса клапана</td>
                    <td colspan="2" bgcolor="#eee"><input type="text" name="form_52" value="<?= $data['form_52'] ?>"
                                                          class="form-control"></td>
                </tr>
            </table>

            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td rowspan="4">
                        Исполнительный механизм
                    </td>
                </tr>
                <tr>
                    <td>
                        Тип
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="radio" name="form_53" <?= $data['form_53'] == 1 ? 'checked' : '' ?>
                                   value="1">Пневматический
                        </label>
                    </td>
                    <td colspan="5">
                        <label class="radio-inline">
                            <input type="radio" name="form_53" <?= $data['form_53'] == 2 ? 'checked' : '' ?>
                                   value="2"> Электрический
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        Давление питания, bar / Напряжение
                        питания
                    </td>
                    <td bgcolor="#eee"><input type="text" name="form_54" value="<?= $data['form_54'] ?>"
                                              class="form-control" placeholder="bar"></td>
                    <td>
                        <label class="radio-inline">
                            <input type="radio" name="form_55" <?= $data['form_55'] == 2 ? 'checked' : '' ?>
                                   value="2"> 400V 50Hz 3~
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="radio" name="form_55" <?= $data['form_55'] == 2 ? 'checked' : '' ?>
                                   value="2"> 230V 50Hz 1~
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="radio" name="form_55" <?= $data['form_55'] == 3 ? 'checked' : '' ?>
                                   value="3"> 115V 50Hz 1~
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="radio" name="form_55" <?= $data['form_55'] == 4 ? 'checked' : '' ?>
                                   value="4"> 24 V 50Hz 1~
                        </label>
                    </td>
                    <td>
                        <label class="radio-inline">
                            <input type="radio" name="form_55" <?= $data['form_55'] == 5 ? 'checked' : '' ?>
                                   value="5"> 24V DC
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        Ручной дублёр
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_56" <?= $data['form_56'] == 1 ? 'checked' : '' ?>
                                   value="1"> Нет
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_56" <?= $data['form_56'] == 2 ? 'checked' : '' ?>
                                   value="2">Да
                        </label>
                    </td>
                </tr>


                <tr>
                    <td rowspan="5">
                        Позиционер
                    </td>
                </tr>
                <tr>
                    <td>Тип</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_57" <?= $data['form_57'] == 1 ? 'checked' : '' ?>
                                   value="1"> Электронный
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_57" <?= $data['form_57'] == 2 ? 'checked' : '' ?>
                                   value="2">Пневматический
                        </label>
                    </td>
                </tr>

                <tr>
                    <td>Входной сигнал</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_58" <?= $data['form_58'] == 1 ? 'checked' : '' ?>
                                   value="1"> 4-20mA
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_58" <?= $data['form_58'] == 2 ? 'checked' : '' ?>
                                   value="2">3-x точечный
                        </label>
                    </td>
                </tr>

                <tr>
                    <td>Требования по взрывозащите</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_59" <?= $data['form_59'] == 1 ? 'checked' : '' ?>
                                   value="1"> Нет
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_59" <?= $data['form_59'] == 2 ? 'checked' : '' ?>
                                   value="2">Да
                        </label>
                    </td>
                </tr>

                <tr>
                    <td>Степень защиты оболочки IP</td>
                    <td colspan="6">
                        <input type="text" name="form_60" value="<?= $data['form_60'] ?>"
                               class="form-control">
                    </td>
                </tr>

                <tr>
                    <td rowspan="4">
                        Соленоид
                    </td>
                </tr>
                <tr>
                    <td>Напряжение питания</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_61" <?= $data['form_61'] == 1 ? 'checked' : '' ?>
                                   value="1"> 24V DC
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_61" <?= $data['form_61'] == 2 ? 'checked' : '' ?>
                                   value="2">230V AC
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>Требования по взрывозащите</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_62" <?= $data['form_62'] == 1 ? 'checked' : '' ?>
                                   value="1"> Нет
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_62" <?= $data['form_62'] == 2 ? 'checked' : '' ?>
                                   value="2">Да
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>Степень защиты оболочки IP</td>
                    <td colspan="6">
                        <input type="text" name="form_63" value="<?= $data['form_63'] ?>"
                               class="form-control">
                    </td>
                </tr>

                <tr>
                    <td rowspan="5">
                        Конечные выключатели
                    </td>
                </tr>
                <tr>
                    <td>Назначение</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_64" <?= $data['form_64'] == 1 ? 'checked' : '' ?>
                                   value="1"> Для открытого положения
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_64" <?= $data['form_64'] == 2 ? 'checked' : '' ?>
                                   value="2">Для закрытого положения
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>Тип</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_65" <?= $data['form_65'] == 1 ? 'checked' : '' ?>
                                   value="1"> Механические
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_65" <?= $data['form_65'] == 2 ? 'checked' : '' ?>
                                   value="2">Индуктивные
                        </label>
                    </td>
                </tr>

                <tr>
                    <td>Требования по взрывозащите</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_66" <?= $data['form_66'] == 1 ? 'checked' : '' ?>
                                   value="1"> Нет
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_66" <?= $data['form_66'] == 2 ? 'checked' : '' ?>
                                   value="2">Да
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>Степень защиты оболочки IP</td>
                    <td colspan="6">
                        <input type="text" name="form_67" value="<?= $data['form_67'] ?>"
                               class="form-control">
                    </td>
                </tr>


                <tr>
                    <td colspan="2">Фильтр-редуктор</td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_68" <?= $data['form_68'] == 1 ? 'checked' : '' ?>
                                   value="1"> Нет
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_68" <?= $data['form_68'] == 2 ? 'checked' : '' ?>
                                   value="2">Да
                        </label>
                    </td>
                </tr>

                <tr>
                    <td rowspan="3" colspan="2">
                        Принадлежности
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_69" <?= $data['form_69'] == 1 ? 'checked' : '' ?>
                                   value="1"> Ответные фланцы
                        </label>
                    </td>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_69" <?= $data['form_69'] == 2 ? 'checked' : '' ?>
                                   value="2">Болты, гайки
                        </label>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <label class="radio-inline">
                            <input type="radio" name="form_69" <?= $data['form_69'] == 1 ? 'checked' : '' ?>
                                   value="1"> Прокладки
                        </label>
                    </td>
                    <td colspan="3">
                    </td>
                </tr>
            </table>
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td align="center" valign="middle">9</td>
                    <td colspan="900" valign="middle">
                        <div class="cel-title">Примечание:</div>
                        <textarea name="COMMENTS" id="input" class="form-control"><?= $data['COMMENTS'] ?></textarea>
                    </td>
                </tr>
            </table>
            <?
            $content = ob_get_contents();
            ob_end_flush();

            if ($_REQUEST['save'] == 'Y') {
                nimdaCreateLead($content);
            }
            ?>
            <hr>
            <? if (empty($_GET['result'])): ?>
                <div class="col-xs-12 text-center">
                    <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                      value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие на&nbsp;обработку
                        <a
                                href="/include/licenses_detail.php" target="_blank">персональных данных</a></label><br>
                    <button type="submit" class="btn-lg btn-info">Отправить</button>
                </div>
            <? endif; ?>
            <div class="col-xs-12 text-center footer">
                <? $APPLICATION->IncludeComponent("bitrix:main.include", "", array(
                        "AREA_FILE_SHOW" => "file",
                        "PATH" => SITE_DIR . "include/forms/footer.php",
                        "EDIT_TEMPLATE" => "standard.php"
                    )
                ); ?>
            </div>
        </div>
    </form>
<? } ?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>