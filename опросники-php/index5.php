<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Паровой тепловой пункт");
$APPLICATION->SetPageProperty("description", "Опросный лист для подготовки индивидуального решения парового теплового пункта от Паровых Систем");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист Паровой тепловой пункт");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index5.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <div class="col-md-12">
            <input type="hidden" name="save" value="Y">
            <input type="hidden" name="TITLE" value="Опросный лист Паровой тепловой пункт">
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
                    <td><input type="text" class="form-control" required placeholder="контактное лицо"
                               name="NAME"
                               value="<?= $data['NAME'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Телефон/факс:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="+7 (000) 000-00-00"
                               name="PHONE"
                               value="<?= $data['PHONE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">E-mail:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="Ваш e-mail"
                               name="EMAIL"
                               value="<?= $data['EMAIL'] ?>"></td>
                </tr>
                </tbody>
            </table>
            <hr>
            <div class="form-group">
                <table border="1" bordercolor="#cccccc" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                        <td height="45" colspan="9" align="center" valign="middle" nowrap bgcolor="#eee">
                            <strong>Греющая сторона</strong>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Давление пара</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p1" value="<?= $data['p1'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Температура пара (для перегретого пара)</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p2" value="<?= $data['p2'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Давление в конденсатопроводе (противодавление)</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p3" value="<?= $data['p3'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="45" colspan="9" align="center" valign="middle" bgcolor="#eee" nowrap><strong>Габариты
                                помещения</strong></td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Габариты помещения</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p4" value="<?= $data['p4'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="45" colspan="9" align="center" bgcolor="#eee" nowrap><strong>Отопление</strong></td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Теплоноситель</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p5" value="<?= $data['p5'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Мощность кВт</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p6" value="<?= $data['p6'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Температурный график, гр.С</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p7" value="<?= $data['p7'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Максимальное рабочее давление кг/см2</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p8" value="<?= $data['p8'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Потери давления в системе кг/см.2</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p9" value="<?= $data['p9'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Высота верхней точки системы м.</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p10" value="<?= $data['p10'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Объем системы м.куб.</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p11" value="<?= $data['p11'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Давление в линии подпитки кг/см.2</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p12" value="<?= $data['p12'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="45" colspan="9" align="center" valign="middle" bgcolor="#eee" nowrap><strong>Горячее
                                водоснабжение (ГВС)</strong></td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Мощность кВт (или пиковый расход м3/час)</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p13" value="<?= $data['p13'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Температура на входе / выходе гр. С</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p14" value="<?= $data['p14'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Давление горячей воды</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p15" value="<?= $data['p15'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Давление холодной воды</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p16" value="<?= $data['p16'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Расход циркуляционной воды</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p17" value="<?= $data['p17'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Падение давления на линии циркуляции ГВС</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p18" value="<?= $data['p18'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Объем системы м.куб.</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p19" value="<?= $data['p19'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="45" colspan="9" align="center" valign="middle" bgcolor="#eee" nowrap><strong>Технологические
                                нужды</strong></td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Мощность кВт (или пиковый расход м3/час)</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p20" value="<?= $data['p20'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Температура на входе / выходе гр.С</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p21" value="<?= $data['p21'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Максимальное рабочее давление кг/см2</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p22" value="<?= $data['p22'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Перепад давления кг/см2</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p23" value="<?= $data['p23'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Высота верхней точки системы м.</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p24" value="<?= $data['p24'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="4" valign="middle">
                            <div class="cel-title">Объем системы м.куб.</div>
                        </td>
                        <td width="260" nowrap colspan="5" valign="middle">
                            <input type="text" name="p25" value="<?= $data['p25'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap colspan="9" rowspan="2" valign="top">
                            <div class="cel-title">Примечания:</div>
                            <textarea name="COMMENTS" id="input"
                                      class="form-control"><?= $data['COMMENTS'] ?></textarea>
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
                                                          value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие
                            на&nbsp;обработку <a
                                    href="/include/licenses_detail.php" target="_blank">персональных
                                данных</a></label><br>
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
        </div>
    </form>
<? } ?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>