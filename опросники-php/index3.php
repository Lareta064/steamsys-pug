<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Обвязка Калорифера");
$APPLICATION->SetPageProperty("description", "Опросный лист для подготовки коммерческого предложения по Обвязке Калорифера от ООО Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист Обвязка Калорифера");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index3.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <div class="col-md-12">
            <input type="hidden" name="save" value="Y">
            <input type="hidden" name="TITLE" value="Опросный лист Обвязка Калорифера">
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
                        <td width="70%">
                            <input type="text" class="form-control" required placeholder="название компании"
                                   name="COMPANY_TITLE"
                                   value="<?= $data['COMPANY_TITLE'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="cel-title">Контактное лицо</div>
                        </td>
                        <td>
                            <input type="text" class="form-control" required placeholder="контактное лицо" name="NAME"
                                   value="<?= $data['NAME'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="cel-title">Телефон/факс:</div>
                        </td>
                        <td>
                            <input type="text" class="form-control" required placeholder="+7 (000) 000-00-00"
                                   name="PHONE"
                                   value="<?= $data['PHONE'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="cel-title">E-mail:</div>
                        </td>
                        <td>
                            <input type="text" class="form-control" required placeholder="Ваш e-mail" name="EMAIL"
                                   value="<?= $data['EMAIL'] ?>">
                        </td>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <table border="1" bordercolor="#cccccc" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="20" align="center" valign="middle" bgcolor="#ddd">№</td>
                        <td align="center" valign="middle" bgcolor="#ddd">Параметр</td>
                        <td align="center" valign="middle" bgcolor="#ddd">Единица измерения</td>
                        <td align="center" valign="middle" bgcolor="#ddd">Установка 1</td>
                        <td align="center" valign="middle" bgcolor="#ddd">Установка 2</td>
                        <td align="center" valign="middle" bgcolor="#ddd">Установка 3</td>
                    </tr>
                    <tr>
                        <td height="45" colspan="6" align="center" valign="middle" bgcolor="#eee"><strong>Греющая
                                сторона –
                                пар</strong></td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">1</td>
                        <td>
                            <div class="cel-title">Тепловая мощность (или расход воздуха – поз. 6)</div>
                        </td>
                        <td align="center" valign="middle">кВт</td>
                        <td>
                            <input class="form-control" type="text" name="power1" value="<?= $data['power1'] ?>"
                                   required>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="power2" value="<?= $data['power2'] ?>">
                        </td>
                        <td>
                            <input class="form-control" type="text" name="power3" value="<?= $data['power3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">2</td>
                        <td>
                            <div class="cel-title">Давление пара</div>
                        </td>
                        <td align="center" valign="middle">бар изб.</td>
                        <td>
                            <input class="form-control" type="text" name="steampress1"
                                   value="<?= $data['steampress1'] ?>" required>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="steampress2"
                                   value="<?= $data['steampress2'] ?>">
                        </td>
                        <td>
                            <input class="form-control" type="text" name="steampress3"
                                   value="<?= $data['steampress3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">3</td>
                        <td>
                            <div class="cel-title">Температура пара (если пар перегретый)</div>
                        </td>
                        <td align="center" valign="middle">°С</td>
                        <td>
                            <input class="form-control" type="text" name="steamt1" value="<?= $data['steamt1'] ?>"
                                   required>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="steamt2" value="<?= $data['steamt2'] ?>">
                        </td>
                        <td>
                            <input class="form-control" type="text" name="steamt3" value="<?= $data['steamt3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">4</td>
                        <td>
                            <div class="cel-title">Противодавление в конденсатной линии / высота подъем
                                конденсатопровода
                            </div>
                        </td>
                        <td align="center" valign="middle">м.в.ст.</td>
                        <td>
                            <input class="form-control" type="text" name="antipress1" value="<?= $data['antipress1'] ?>"
                                   required>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="antipress2"
                                   value="<?= $data['antipress2'] ?>">
                        </td>
                        <td>
                            <input class="form-control" type="text" name="antipress3"
                                   value="<?= $data['antipress3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">5</td>
                        <td>
                            <div class="cel-title">Требуется ли автоматическое регулирование температуры воздуха?</div>
                        </td>
                        <td align="center" valign="middle">
                            <p align="center">&nbsp;</p>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="autoreg1" value="<?= $data['autoreg1'] ?>"
                                   required>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="autoreg2" value="<?= $data['autoreg2'] ?>">
                        </td>
                        <td>
                            <input class="form-control" type="text" name="autoreg3" value="<?= $data['autoreg3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td height="45" colspan="6" align="center" valign="middle" bgcolor="#eee"><strong>Нагреваемая
                                сторона –
                                воздух</strong></td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">6</td>
                        <td>
                            <div class="cel-title">Расход воздуха</div>
                        </td>
                        <td align="center" valign="middle">тыс. м3/ч</td>
                        <td>
                            <input class="form-control" type="text" name="airrash1" value="<?= $data['airrash1'] ?>"
                                   required>
                        </td>
                        <td>
                            <input class="form-control" type="text" name="airrash2" value="<?= $data['airrash2'] ?>">
                        </td>
                        <td>
                            <input class="form-control" type="text" name="airrash3" value="<?= $data['airrash3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">7</td>
                        <td>
                            <div class="cel-title">Температура воздуха на входе (минимальная)</div>
                        </td>
                        <td align="center" valign="middle">°С</td>
                        <td><input class="form-control" type="text" name="tmin1" value="<?= $data['tmin1'] ?>" required>
                        </td>
                        <td><input class="form-control" type="text" name="tmin2" value="<?= $data['tmin2'] ?>"></td>
                        <td><input class="form-control" type="text" name="tmin3" value="<?= $data['tmin3'] ?>"></td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">8</td>
                        <td>
                            <div class="cel-title">Температура воздуха на выходе (требуемая)</div>
                        </td>
                        <td align="center" valign="middle">°С</td>
                        <td><input class="form-control" type="text" name="ttarget1" value="<?= $data['ttarget1'] ?>"
                                   required></td>
                        <td><input class="form-control" type="text" name="ttarget2" value="<?= $data['ttarget2'] ?>">
                        </td>
                        <td><input class="form-control" type="text" name="ttarget3" value="<?= $data['ttarget3'] ?>">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">9</td>
                        <td colspan="5" valign="top">
                            <div class="cel-title">Примечание:</div>
                            <textarea class="form-control" name="COMMENTS"><?= $data['COMMENTS'] ?></textarea>
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
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                          value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие
                            на&nbsp;обработку <a
                                    href="/include/licenses_detail.php" target="_blank">персональных
                                данных</a></label><br>
                        <button type="submit" class="btn-lg btn-info">Отправить</button>
                    </div>
                <? endif; ?>
                <p>Поля помеченные <span style="color:red">*</span> являются обязательными для заполнения</p>
            </div>

            <div class="col-md-12 text-center footer">
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