<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист РОУ");
$APPLICATION->SetPageProperty("description", "Опросный лист для подготовки коммерческого предложения по поставке редукционно охладительных установок");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист РОУ");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index8.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Опросный лист РОУ">
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
                <td>
                    <div class="cel-title">Организация:</div>
                </td>
                <td><input type="text" class="form-control" required placeholder="название компании"
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
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td height="35" align="center" valign="middle" bgcolor="#eee">№</td>
                    <td align="center" valign="middle" bgcolor="#eee">Параметр</td>
                    <td align="center" valign="middle" bgcolor="#eee">Единица измерения</td>
                    <td align="center" valign="middle" bgcolor="#eee">Значение</td>
                </tr>
                <tr>
                    <td align="center" valign="middle">1</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Расход пара мин/ном/макс</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="steamr" value="<?= $data['steamr'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Давление пара на входе мин./макс</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="steampress" value="<?= $data['steampress'] ?>" class="form-control"
                               required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">3</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Температура пара на входе мин./макс</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="steamtstart" value="<?= $data['steamtstart'] ?>" class="form-control"
                               required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">4</td>
                    <td align="left" valign="middle"><p>Давление пара на выходе </p></td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="steamtpressstop" value="<?= $data['steamtpressstop'] ?>"
                               class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">5</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Температура пара на выходе</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="steamtstop" value="<?= $data['steamtstop'] ?>" class="form-control"
                               required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">6</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Располагаемое давление охлаждающей воды мин./макс</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="vaterpress" value="<?= $data['vaterpress'] ?>" class="form-control"
                               required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">7</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Температура охлаждающей воды</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="vatert" value="<?= $data['vatert'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Противодавление в конденсатопроводе</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td align="center" valign="middle">
                        <input type="text" name="antipress" value="<?= $data['antipress'] ?>" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">9</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Расположение</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td valign="middle">
                        <div class="cel-title">
                            <input type="radio" name="raspol" value="1"
                                   <? if ($data['raspol'] == 1): ?>checked<? endif; ?>> в помещении<br>
                            <input type="radio" name="raspol" value="2"
                                   <? if ($data['raspol'] == 2): ?>checked<? endif; ?>> на улице
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">10</td>
                    <td align="left" valign="middle">
                        <div class="cel-title">Тип привода регулирующих клапанов</div>
                    </td>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td valign="middle">
                        <div class="cel-title">
                            <input type="radio" name="typeklap" value="1"
                                   <? if ($data['typeklap'] == 1): ?>checked<? endif; ?>>электрический<br>
                            <input type="radio" name="typeklap" value="2"
                                   <? if ($data['typeklap'] == 2): ?>checked<? endif; ?>>пневматический
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle"><p align="center">&nbsp;</p></td>
                    <td colspan="3" valign="middle">
                        <div class="cel-title"><em>Вы можете заказать только устройства для снижения давления /
                                температуры, либо  комплектную установку со всеми необходимыми устройствами управления и
                                безопасности:</em></div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle"><p align="center">11</p></td>
                    <td colspan="3" valign="middle">
                        <div class="cel-title">Комплектация устройствами КИП:</div>
                        <div class="radio form-check cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="kip" value="1"
                                       <? if ($data['kip'] == 1): ?>checked<? endif; ?>>шкаф управления
                            </label>
                            <label class="radio-inline">
                                <input class="form-check-input" type="radio" name="kip" value="2"
                                       <? if ($data['kip'] == 2): ?>checked<? endif; ?>>датчик температуры
                            </label>
                            <label class="radio-inline">
                                <input class="form-check-input" type="radio" name="kip" value="3"
                                       <? if ($data['kip'] == 3): ?>checked<? endif; ?>>датчик давления
                            </label>
                            <label class="radio-inline">
                                <input class="form-check-input" type="radio" name="kip" value="4"
                                       <? if ($data['kip'] == 4): ?>checked<? endif; ?>>термометры
                            </label>
                            <label class="radio-inline">
                                <input class="form-check-input" type="radio" name="kip" value="5"
                                       <? if ($data['kip'] == 5): ?>checked<? endif; ?>>манометры
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle"><p align="center">12</p></td>
                    <td colspan="3" valign="middle">
                        <div class="cel-title">Дополнительная комплектация:</div>
                        <div class="radio cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="dopkomp" value="1"
                                       <? if ($data['dopkomp'] == 1): ?>checked<? endif; ?>>запорная арматура
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="dopkomp" value="2"
                                       <? if ($data['dopkomp'] == 2): ?>checked<? endif; ?>>теплоизоляция трубопроводов
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="dopkomp" value="3"
                                       <? if ($data['dopkomp'] == 3): ?>checked<? endif; ?>>конденсатоотводчики
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="dopkomp" value="4"
                                       <? if ($data['dopkomp'] == 4): ?>checked<? endif; ?>>предохранительный клапан
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle"><p align="center">13</p></td>
                    <td colspan="3" valign="middle">
                        <div class="cel-title">Примечание:</div>
                        <textarea name="COMMENTS" id="input" class="form-control"></textarea>
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

            <div class="row">
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