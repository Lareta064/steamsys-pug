<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Конденсатный насос и станция сбора и возврата конденсата");
$APPLICATION->SetPageProperty("description", "Опросный лист для подбора конденсатного насоса и станции сбора и возврата конденсата в ООО Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Конденсатный насос и станция сбора и возврата конденсата");
$data = dataForms();
?>
<?
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index.php';
} else {
    ?>
    <form action="<?= $APPLICATION->GetCurPage(false); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Конденсатный насос и станция сбора и возврата конденсата">
        <input type="hidden" name="rand" value="<?= rand() ?>">
        <? foreach ($_GET as $key => $item) {
            ?>
            <input type="hidden" name="<?= $key ?>" value="<?= $item ?>">
            <?
        } ?>
        <div class="alert alert-warning reqwarning" role="alert" style="display: none">
            Пожалуйста заполните выделенные поля - они обязательны.
        </div>

        <div class="alert alert-warning formerror" role="alert" style="display: none"></div>
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
                               name="COMPANY_TITLE" value="<?= $data['COMPANY_TITLE'] ?>">
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
                        <input type="text" class="form-control" required placeholder="+7 (000) 000-00-00" name="PHONE"
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
            <table border="1" bordercolor="#ccc" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                    <td width="30" height="40" align="center" valign="middle" bgcolor="#eee"><strong>№</strong></td>
                    <td colspan="2" align="center" valign="middle" bgcolor="#eee"><strong>Параметр</strong></td>
                    <td align="center" valign="middle" bgcolor="#eee"><strong>Единица измерения</strong></td>
                    <td colspan="5" align="center" valign="middle" bgcolor="#eee"><strong>Значение</strong></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">1</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Максимальный расход конденсата:</div>
                    </td>
                    <td align="center" valign="middle">кг/ч</td>
                    <td colspan="5" valign="middle">
                        <input type="text" name="trashod" value="<?= $data['trashod'] ?>" class="form-control"
                               id="trashod" placeholder="килограмм в час">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2.1</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Количество источников конденсата:</div>
                    </td>
                    <td align="center" valign="middle">шт.</td>
                    <td colspan="5" valign="middle">
                        <input type="text" name="tkolist" value="<?= $data['tkolist'] ?>" class="form-control"
                               id="tkolist" placeholder="">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2.2</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Расход на каждом источнике:</div>
                    </td>
                    <td align="center" valign="middle">кг/ч</td>
                    <td valign="middle">
                        <input type="text" name="trashod1" value="<?= $data['trashod1'] ?>" class="form-control"
                               id="trashod1" placeholder="">
                    </td>
                    <td valign="middle">
                        <input type="text" name="trashod2" value="<?= $data['trashod2'] ?>" class="form-control"
                               id="trashod2" placeholder="">
                    </td>
                    <td valign="middle">
                        <input type="text" name="trashod3" value="<?= $data['trashod3'] ?>" class="form-control"
                               id="trashod3" placeholder="">
                    </td>
                    <td valign="middle">
                        <input type="text" name="trashod4" value="<?= $data['trashod4'] ?>" class="form-control"
                               id="trashod4" placeholder="">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2.3</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Температура конденсата:</div>
                    </td>
                    <td align="center" valign="middle">°С</td>
                    <td valign="middle">
                        <input type="text" name="ttemp1" value="<?= $data['ttemp1'] ?>" class="form-control" id="ttemp1"
                               placeholder="">
                    </td>
                    <td valign="middle">
                        <input type="text" name="ttemp2" value="<?= $data['ttemp2'] ?>" class="form-control" id="ttemp2"
                               placeholder="">
                    </td>
                    <td valign="middle">
                        <input type="text" name="ttemp3" value="<?= $data['ttemp3'] ?>" class="form-control" id="ttemp3"
                               placeholder="">
                    </td>
                    <td valign="middle">
                        <input type="text" name="ttemp4" value="<?= $data['ttemp4'] ?>" class="form-control" id="ttemp4"
                               placeholder="">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">3</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Место расположения :</div>
                    </td>
                    <td align="center" valign="middle"><p align="center"> </p></td>
                    <td colspan="5" valign="middle">
                        <div class="radio">
                            <div class="cel-title-30">
                                <input type="radio" id="place-01" name="rrasp" value="1"
                                       <? if ($data['rrasp'] == 1): ?>checked<? endif; ?>> в помещении с положительной
                                температурой<br>
                                <input type="radio" id="place-02" name="rrasp" value="2"
                                       <? if ($data['rrasp'] == 2): ?>checked<? endif; ?>> на улице
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">4</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Для механического насоса - противодавление со стороны конденсатной линии,<br>Для
                            электрического насоса - требуемое давление на выходе насоса:
                        </div>
                    </td>
                    <td align="center" valign="middle">бар</td>
                    <td colspan="5" valign="middle">
                        <input type="text" name="tdavlenie" value="<?= $data['tdavlenie'] ?>" class="form-control"
                               id="tdavlenie">
                    </td>
                </tr>
                <tr>
                    <td height="40" align="center" valign="middle" bgcolor="#eee">5</td>
                    <td colspan="8" align="center" valign="middle" bgcolor="#eee"><strong>Тип насоса:</strong></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">5.1</td>
                    <td valign="middle">
                        <div class="cel-title">Электрический:</div>
                    </td>
                    <td colspan="7" valign="middle">

                        <table width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tbody>
                            <tr>
                                <td>
                                    <div class="cel-title">Напряжение питания:</div>
                                    <div class="radio cel-title cel-title-30">
                                        <input type="radio" id="vol-01" name="rvolt" value="1"
                                               <? if ($data['rvolt'] == 1): ?>checked<? endif; ?>>
                                        1 X 230В<br>
                                        <input type="radio" id="vol-02" name="rvolt" value="2"
                                               <? if ($data['rvolt'] == 2): ?>checked<? endif; ?>>
                                        3 Х 380В
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Количество насосов:</div>
                                    <div class="radio cel-title cel-title-30">
                                        <input type="radio" id="pamp-01" name="rpamp" value="1"
                                               <? if ($data['rpamp'] == 1): ?>checked<? endif; ?>>1<br>
                                        <input type="radio" id="pamp-02" name="rpamp" value="2"
                                               <? if ($data['rpamp'] == 2): ?>checked<? endif; ?>>2
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">
                                        Визуальный контроль уровня в конденсатной емкости:
                                    </div>
                                    <div class="radio cel-title">
                                        <input type="checkbox" name="cvizkontr1" value="1"
                                               <? if ($data['cvizkontr1'] == 1): ?>checked<? endif; ?>>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Выходной сигнал уровня:</div>
                                    <div class="radio cel-title cel-title-30">
                                        <input type="radio" id="exlevel-01" name="exitlevel" value="1"
                                               <? if ($data['exitlevel'] == 1): ?>checked<? endif; ?>>0(4)…20мА<br>
                                        <input type="radio" id="exlevel-02" name="exitlevel" value="2"
                                               <? if ($data['exitlevel'] == 2): ?>checked<? endif; ?>>0 (2)…10В<br>
                                        <input type="radio" id="exlevel-03" name="exitlevel" value="3"
                                               <? if ($data['exitlevel'] == 3): ?>checked<? endif; ?>>дискретные сигналы
                                        предельных уровней
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">5.2</td>
                    <td valign="middle">
                        <div class="cel-title">Механический:</div>
                    </td>
                    <td colspan="7" valign="middle">
                        <table width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tbody>
                            <tr>
                                <td width="9%">&nbsp;</td>
                                <td width="10%">&nbsp;</td>
                                <td colspan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td rowspan="2">
                                    <div class="cel-title">Рабочая среда:</div>
                                </td>
                                <td>
                                    <div class="cel-title">
                                        <input type="checkbox" name="rsreda" value="1"
                                               <? if ($data['rsreda'] == 1): ?>checked<? endif; ?>> Пар
                                    </div>
                                </td>
                                <td width="38%">
                                    <div class="cel-title">Располагаемое давление (бар):</div>
                                    <input type="text" name="tdav" value="<?= $data['tdav'] ?>" id="input2"
                                           class="form-control" placeholder="бар">
                                </td>
                                <td width="43%">
                                    <div class="cel-title">Температура (градусы Цельсия):</div>
                                    <input type="text" name="ttem" value="<?= $data['ttem'] ?>" id="input3"
                                           class="form-control" placeholder="градусы Цельсия">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">
                                        <input type="checkbox" name="rsreda" value="1"
                                               <? if ($data['rsreda'] == 1): ?>checked<? endif; ?>> Воздух
                                        <div/>
                                </td>
                                <td colspan="2">
                                    <div class="cel-title">Располагаемое давление (бар):
                                    </div>
                                    <input type="text" name="traspdav" value="<?= $data['traspdav'] ?>" id="input4"
                                           class="form-control" placeholder="бар">
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <div class="cel-title">
                                        Визуальный контроль уровня конденсата в насосе:
                                    </div>
                                    <div class="cel-title">
                                        <input type="checkbox" name="cvizkontr" value="1"
                                               <? if ($data['cvizkontr'] == 1): ?>checked<? endif; ?>>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <div class="cel-title">
                                        Счетчик импульсов для подсчета объема перекаченного конденсата:
                                    </div>
                                    <div class="cel-title">
                                        <input type="checkbox" name="cimpcounter" value="1"
                                               <? if ($data['cimpcounter'] == 1): ?>checked<? endif; ?>>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">6.</td>
                    <td colspan="8" valign="middle">
                        <div class="cel-title">Примечание:</div>
                        <br>
                        <textarea name="COMMENTS" id="input" class="form-control"
                                  rows="3"><?= $data['COMMENTS'] ?></textarea>
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
            <div class="row">
                <? if (empty($_GET['result'])): ?>

                    <div class="col-xs-12 text-center">
                        <hr>
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