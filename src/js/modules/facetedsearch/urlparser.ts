/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 */

const getQueryParameters = (params: string) => {
  if (!params) {
    return [];
  }

  return params.split('&').map((str) => {
    const eqIndex = str.indexOf('=');

    if (eqIndex === -1) {
      return {
        name: str,
        value: '',
      };
    }

    const key = str.slice(0, eqIndex);
    const rawVal = str.slice(eqIndex + 1);
    const value = decodeURIComponent(rawVal.replace(/\+/g, ' '));

    return {
      name: key,
      value,
    };
  });
};

export default getQueryParameters;
